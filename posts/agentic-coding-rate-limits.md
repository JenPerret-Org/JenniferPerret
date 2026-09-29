# When Your AI Agents Start Thrashing GitHub: Lessons from Building AgentCraftworks

*I went from hitting the rate limit wall every single morning to a five-layer system that keeps dozens of agents running smoothly. Here's what I wish someone had told me before I scaled up.*

---

Every morning. Somewhere around 9am. Like clockwork.

My GitHub Actions workflows would start failing. Not crashing, nothing that dramatic. Just quietly returning 403s. Issues weren't getting triaged. PRs weren't getting reviewed. CI failures sat there undiagnosed. The agents I'd built to run my workflow automation had ground to a halt, and for longer than I'd like to admit, I couldn't figure out why.

When I finally dug in, the answer was embarrassingly simple: **I had run out of GitHub API quota.**

I felt that one. I'm building [AgentCraftworks](https://github.com/AgentCraftworks/AgentCraftworks), a governance and orchestration platform so enterprises can run AI agents *safely* on GitHub. And my own agents were thrashing the API and taking each other down. Every morning. At 9am.

The irony was not lost on me. It still isn't. But it taught me so much, and I want to share all of it, including the five-layer system I built to fix it.

---

The GitHub REST API gives each **authenticated identity** 5,000 requests per hour. That sounds like a lot. It is a lot, for a human. It is not a lot when you have agents.

My issue triage sweep scanned every open issue, fetched labels, looked for duplicates, and checked PR state, easily 200 to 400 API calls per run. My CI coach read workflow run logs, fetched check annotations, and posted PR comments, another 50 to 100 calls per failure. The Copilot review responder read the diff, fetched CODEOWNERS, and posted suggestion commits for 30 to 80 calls per review. The daily standup report aggregated commits, PRs, and issues across repos for 100 to 200 more. And the link checker? It fetched every URL referenced in the docs. Unbounded.

Now schedule all of those at 9am. Watch them race to burn through the 5,000-request budget in the first fifteen minutes of the workday. Everything else gets a 403 for the next forty-five.

This is the agentic scaling wall. It hits every team that goes from "a few automations" to "agents running the workflow." And it's going to hit a lot more of us, a lot sooner than we expect, as AI coding tools multiply the number of things calling the GitHub API on our behalf.

## Layer 0: Identity Collapse, the Root Cause Nobody Talks About

Before any of the clever technical fixes, here is the most important lesson, and the one I'm most sheepish about.

**Every one of my workflows was authenticating as the same human identity.**

Every `GITHUB_TOKEN` in every workflow was scoped to the repo but consumed from the same user quota. Every `gh` CLI call in every script ran as me, the developer who set up the workflows. I had a dozen "agents" doing work, and GitHub saw exactly one user hammering the API.

The fix was fundamental: stop using human identity for machine work.

I switched to [GitHub App tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app). GitHub Apps get their own rate limit bucket, **15,000 requests per hour**, three times the personal limit. And critically, that quota is separate from any human's. My agents stopped competing with me.

```yaml
- name: Generate App token
  id: app-token
  uses: actions/create-github-app-token@v3
  with:
    app-id: ${{ secrets.GH_APP_ID }}
    private-key: ${{ secrets.GH_APP_PRIVATE_KEY }}

- name: Do agent work
  env:
    GITHUB_TOKEN: ${{ steps.app-token.outputs.token }}
  run: # now runs as the App, not as you
```

That single change tripled my effective budget. I wish I could tell you it was enough. It wasn't. Fifteen thousand requests an hour still runs out if you don't manage how you spend them.

## Layer 1: Stop Your Agents From Racing Each Other

With identity fixed, I looked at *when* my agents ran. The answer was painful: all at once.

Every scheduled workflow was set to `0 9 * * *`. Nine o'clock. Every morning. All of them. Together.

```
9:00am — issue-triage-sweep    starts  → 350 API calls
9:00am — ci-coach              starts  → 120 API calls
9:00am — ci-doctor             starts  → 80 API calls
9:00am — sub-issue-closer      starts  → 60 API calls
9:00am — daily-doc-updater     starts  → 90 API calls
```

Seven hundred API calls in the first minute. On top of every webhook firing from overnight activity. On top of Dependabot opening its morning batch of PRs.

The fix was to stagger the schedules. It sounds so obvious in retrospect. It was not obvious when each workflow got added one at a time, on different days, each one perfectly reasonable on its own.

```yaml
# Before: all at 9am
- cron: '0 9 * * *'

# After: spread across the morning
ghaw-issue-triage:     '0 9 * * *'   # anchor: highest priority
ghaw-ci-coach:         '0 10 * * *'  # 1 hour later
ghaw-ci-doctor:        '0 11 * * *'  # 2 hours later
ghaw-sub-issue-closer: '0 12 * * *'  # 3 hours later
ghaw-daily-doc-updater: '0 9 * * 2-5' # skip Monday (triage day)
```

The second fix was **concurrency groups**. Without them, a slow run doesn't block the next trigger. The schedule fires again, and now you have two copies of the same workflow racing in parallel, each one eating full quota.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

I added this to 21 workflows in one pass. If a run is still going when the next trigger fires, the old run gets cancelled. One active run per workflow, always.

## Layer 2: Abort Before You Waste What You Have Left

Even with staggered schedules and concurrency control, bad days still happen. Webhook floods. Giant PRs touching hundreds of files. A dependency update that ripples through every repo. The quota gets low.

The outcome I feared most was an important workflow, say, diagnosing a CI failure during a production incident, getting a 403 because a link checker ran first and burned the last 200 requests.

So every bulk scheduled workflow now starts with a budget check:

```yaml
- name: Check rate limit budget
  id: rate-check
  run: |
    REMAINING=$(gh api rate_limit --jq '.resources.core.remaining' 2>/dev/null || echo "5000")
    echo "remaining=$REMAINING" >> "$GITHUB_OUTPUT"
    if [ "$REMAINING" -lt 300 ]; then
      echo "::warning::Rate budget low ($REMAINING remaining) — skipping run."
      echo "skip=true" >> "$GITHUB_OUTPUT"
    else
      echo "skip=false" >> "$GITHUB_OUTPUT"
    fi
  env:
    GH_TOKEN: ${{ steps.app-token.outputs.token }}
```

Three details matter here, and I learned each of them the hard way. First, the fallback value is permissive, not restrictive. If the `gh api` call itself fails from a network blip or a bad token, it defaults to `5000` and assumes full budget. The check fails *open*, not *closed*, because a broken budget check should never block legitimate work. Second, the threshold is 300, not zero. You want to stop before you're empty, not when you are. Three hundred requests is plenty for a webhook handler, a PR comment, or a CI status check. It is not enough for a bulk sweep. Third, every step after the check has to actually gate on it. A pre-check is useless if the work runs anyway.

```yaml
- name: Run triage sweep
  if: steps.rate-check.outputs.skip != 'true'
  run: npx tsx src/jobs/issue-triage-sweep.ts
```

## Layer 3: Make Fewer Calls for the Same Information

Everything so far is about *managing* quota. This layer is about *needing less of it*, and honestly, it's the one that made me wince the most when I looked at my own code.

My issue triage sweep was doing this:

```typescript
// Fetch 1: paginate all open issues (N pages × 100 items)
const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  state: 'open', per_page: 100
});

// Fetch 2: for each issue that might be a PR, check PR state
for (const issue of issues) {
  if (issue.pull_request) {
    const pr = await octokit.rest.pulls.get({ pull_number: issue.number });
  }
}
```

In a repo with 200 open issues and 40 PRs, that's 2 pagination requests plus 40 individual PR fetches. **Forty-two API calls**, just to build the list.

The GraphQL equivalent is one request per hundred items:

```graphql
query($owner: String!, $repo: String!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    issues(first: 100, after: $cursor, states: OPEN) {
      nodes {
        number title labels(first: 10) { nodes { name } }
        assignees(first: 3) { nodes { login } }
        # For PRs: get the PR state inline
        ... on PullRequest { merged isDraft reviewDecision }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
}
```

No N+1 fetches for PR details. For 200 issues, that's **2 GraphQL requests instead of 42 REST calls**, roughly a 95% reduction. Ninety-five percent. From one query.

> **Important:** Always use `octokit.request()` for REST calls, not `octokit.rest.*`. In Octokit v16+, the `.rest.*` namespace generates additional overhead. GraphQL calls go through `octokit.graphql()`.

Then there are ETags. GitHub's REST API supports [conditional requests](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#conditional-requests): send an `If-None-Match` header with the ETag from your last fetch, and if nothing changed, GitHub returns **HTTP 304 Not Modified**. A 304 is essentially free. It doesn't count against your rate limit the same way, returns no body, and resolves in milliseconds.

```typescript
export async function fetchWithETag<T>(
  url: string,
  fetcher: (headers: Record<string, string>) => Promise<{ data: T; etag?: string }>,
  options: FetchWithETagOptions,
): Promise<T | null> {
  const { store, key } = options;
  const cachedETag = store.getETag(key);

  const headers: Record<string, string> = {};
  if (cachedETag) {
    headers['If-None-Match'] = cachedETag;
  }

  try {
    const result = await fetcher(headers);
    if (result.etag) {
      store.setETag(key, result.etag);
      store.setData(key, result.data);
    }
    return result.data;
  } catch (error: unknown) {
    // 304 Not Modified — return cached data
    if (isNotModifiedError(error)) {
      return store.getData<T>(key) ?? null;
    }
    throw error;
  }
}
```

Store the ETags in a file, persist it with `actions/cache`, and every later run that fetches unchanged data gets a free 304. This shines for things like repo metadata, CODEOWNERS files, and label lists, data that changes rarely but gets fetched constantly.

The last piece was cross-workflow deduplication. When five workflows all start within ten minutes of each other, they each independently fetch the same list of open issues, the same list of recent PRs. Identical calls, five times over. So now the first workflow to run fetches and caches a daily snapshot, and everyone after it reads the cache instead of the API.

```yaml
- name: Restore API snapshot cache
  uses: actions/cache@v4
  with:
    path: .cache/api-snapshot.json
    key: api-snapshot-${{ github.repository }}-${{ env.DATE }}
    restore-keys: api-snapshot-${{ github.repository }}-
```

One fetch per day, shared across every workflow. In a busy repo, the cache hit rate is extremely high.

## Layer 4: Runtime Enforcement with the Rate Governor

Every layer above is *preventive*. It lowers the odds of hitting the wall. But odds aren't certainty, and I needed a runtime safety net for the days things go sideways anyway.

So I built a **Rate Governor**, a six-pattern in-process rate limiter that wraps every outbound GitHub API call.

```
Every API call → checkQuota() → [allowed / throttled / blocked]
                     ↓
         Token bucket + Sliding window
                     ↓
         Traffic light: GREEN / YELLOW / RED
                     ↓
         Circuit breaker (opens on consecutive failures)
                     ↓
         Cascade detector (detects cross-service failure spread)
                     ↓
         Priority retry queue (P0 critical / P1 high / P2 normal)
```

The key insight is graduated response. Instead of a binary allow or block, the governor changes behavior as quota drains. At **GREEN**, above 60% remaining, everything runs full speed. At **YELLOW**, between 20% and 60%, low-priority requests get throttled while normal requests proceed. At **RED**, below 20%, only P0 critical requests pass, and P1 and P2 queue up for retry.

```typescript
const result = await checkQuota({
  callerId: 'issue-triage-sweep',
  priority: RatePriority.P2, // normal priority
  estimatedCalls: 5,
});

if (!result.allowed) {
  // Wait for retryAfter, or skip this batch
  await sleep(result.retryAfter);
}

const response = await octokit.request('GET /repos/{owner}/{repo}/issues', params);
recordResponse(response.headers); // feeds back into governor
```

That `recordResponse()` call is the part that matters most. It reads the `X-RateLimit-Remaining` header from GitHub's response and updates the governor in real time, so it knows the *actual* remaining budget, not a guess. And if a request gets a 429, `record429()` trips the circuit breaker immediately and kicks off exponential backoff.

---

Put together, it looks like this:

```
lisLayer 0: Identity     — GitHub App tokens (15K/hr, separate from human quota)
Layer 1: Scheduling   — Staggered crons + concurrency groups (no pile-ons)
Layer 2: Pre-flight   — Rate budget check at workflow start (abort early)
Layer 3: Efficiency   — GraphQL, ETags, shared cache (fewer calls needed)
Layer 4: Runtime      — Rate Governor with traffic light + circuit breaker
```

Each layer catches what the one above it misses. An efficient GraphQL query still gets pre-checked and runtime-governed. A staggered schedule still has an emergency abort. A GitHub App identity still gets managed by everything else.

The result: I went from hitting the wall every morning to running dozens of agent workflows across multiple repos, comfortably, with headroom to spare.

But here's the part I keep sitting with.

When a human developer uses the GitHub API, the requests come one at a time, with natural thinking time between them. The rate limit was designed for that pattern. For us. When agents use the API, the requests come in parallel, on schedules, in response to webhooks, in coordinated bursts. The rate limit was not designed for that. And my instinct, my usual drive to *make it go faster*, was exactly what created the problem.

If your team is adopting agentic workflows, more AI-assisted reviews, more automated triage, more multi-agent coordination, you will hit this wall. The only question is whether you hit it reactively, debugging mysterious 403s at 9am like I did, or proactively, before you need to.

The good news is the fixes are well understood and they compose. You don't need all five layers on day one. Start with GitHub App identity and staggered schedules with concurrency groups. Those two alone buy you a lot of room. Add pre-flight checks, GraphQL and ETags, and a runtime governor as your agent footprint grows. And above all, treat rate limits as a shared resource. In a multi-agent system, every agent spends from the same budget. Design them to cooperate, not compete.

I built all of this because I was too busy shipping to notice my own agents were fighting each other. So the real question for all of us is this: what else are our agents quietly competing over, and will we see it before 9am tomorrow?

---

*AgentCraftworks is an open-source GitHub App for governing and orchestrating AI agents. The Rate Governor, ETag cache, and workflow patterns in this post are all available in the* [*AgentCraftworks repository*](https://github.com/AgentCraftworks/AgentCraftworks) *under the MIT license.*
