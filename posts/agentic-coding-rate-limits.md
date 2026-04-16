# When Your AI Agents Start Thrashing GitHub: Lessons from Building AgentCraftworks

*How we went from hitting the rate limit wall every morning to a five-layer system that keeps dozens of agents running smoothly — and what every team moving to agentic workflows needs to know.*

---

## The Morning Wall

It started with a pattern we couldn't ignore.

Every morning, somewhere around 9am, our GitHub Actions workflows would start failing. Not crashing — just quietly returning 403s. Issues weren't being triaged. PRs weren't getting reviewed. CI failures weren't being diagnosed. The agents we'd built to run the team's workflow automation had ground to a halt, and nobody could figure out why.

The answer, when we finally dug in, was embarrassingly simple: **we'd run out of GitHub API quota**.

We were building [AgentCraftworks](https://github.com/AgentCraftworks/AgentCraftworks) — a governance and orchestration platform for AI agents on GitHub. The irony wasn't lost on us. We were building a system to help enterprises run AI agents safely, and our own agents were thrashing the API and taking each other down.

Here's everything we learned, and the five-layer system we built to fix it.

---

## Understanding the Problem: You Have One Bucket, Your Agents Have Many Appetites

The GitHub REST API gives each **authenticated identity** 5,000 requests per hour. That sounds like a lot until you have agents doing it:

- **Issue triage sweep**: scans every open issue, fetches labels, finds duplicates, checks PR state — easily 200–400 API calls per run
- **CI coach**: reads workflow run logs, fetches check annotations, posts PR comments — 50–100 calls per failure
- **Copilot review responder**: reads the PR diff, fetches CODEOWNERS, posts suggestion commits — 30–80 calls per review
- **Link checker**: fetches every URL referenced in docs — unbounded
- **Daily standup report**: aggregates commits, PRs, and issues across repos — 100–200 calls

Now schedule all of these at 9am. Watch them race to consume your 5,000-request budget in the first 15 minutes of the workday. Everything else gets a 403 for the next 45 minutes.

This is the agentic scaling wall. It hits every team that goes from "a few automations" to "agents running the workflow." And it's going to hit more teams, sooner than they expect, as AI coding tools multiply the number of things that want to call the GitHub API on your behalf.

---

## Layer 0: The Root Cause Nobody Talks About — Identity Collapse

Before we get to the technical fixes, the most important lesson:

**All of our workflows were authenticating as the same human identity.**

Every `GITHUB_TOKEN` in every workflow was scoped to the repo but consumed from the same user quota. Every `gh` CLI call in every script ran as the developer who set up the workflows. We had a dozen "agents" doing work, but GitHub saw it as one user hammering the API.

The fix was fundamental: **stop using human identity for machine work**.

We switched to [GitHub App tokens](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-an-installation-access-token-for-a-github-app). GitHub Apps get their own rate limit bucket — **15,000 requests per hour** (3× the personal limit) — and critically, that quota is separate from any human's quota. Your agents stop competing with your developers.

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

This single change tripled our effective budget. But it wasn't enough on its own — 15,000 requests per hour still runs out if you don't manage how you spend them.

---

## Layer 1: Stop Your Agents From Racing Each Other

With human identity fixed, we looked at *when* our agents ran. The answer was: all at once.

Every scheduled workflow was set to run at `0 9 * * *`. Nine o'clock. Every morning. All of them. Together.

```
9:00am — issue-triage-sweep    starts  → 350 API calls
9:00am — ci-coach              starts  → 120 API calls
9:00am — ci-doctor             starts  → 80 API calls
9:00am — sub-issue-closer      starts  → 60 API calls
9:00am — daily-doc-updater     starts  → 90 API calls
```

700 API calls in the first minute. On top of any webhooks firing from overnight activity. On top of Dependabot opening its morning batch of PRs.

**Fix: Stagger your schedules.** This sounds obvious in retrospect. It wasn't obvious when each workflow was added one at a time by different people.

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

The second fix was **concurrency groups**. Without them, a slow workflow run doesn't block the next trigger — the schedule fires again and you have two copies of the same workflow racing in parallel, each consuming full quota.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

We added this to 21 workflows in one pass. If a run is still in progress when the next trigger fires, the old run is cancelled. One active run per workflow, always.

---

## Layer 2: Abort Before You Waste What You Have Left

Even with staggered schedules and concurrency control, a bad day happens: webhook floods, big PRs with hundreds of files, a dependency update that touches every repo. The quota gets low.

The worst outcome is an important workflow — say, CI failure diagnosis on a production incident — getting a 403 because a link checker ran first and burned the remaining 200 requests.

**Fix: Rate-limit pre-check steps.** Every bulk scheduled workflow now starts with this:

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

Three important details here:

1. **The fallback value is permissive, not restrictive.** If the `gh api` call itself fails (network issue, bad token), we default to `5000` — full budget assumed. The pre-check fails *open*, not *closed*. A broken budget check should never block legitimate work.

2. **The threshold is 300, not zero.** You want to stop before you're empty, not when you are. 300 requests is enough for a webhook handler, a PR comment, or a CI status check. It's not enough for a bulk sweep.

3. **Every subsequent step gates on `skip != 'true'`.** The pre-check is useless if steps run anyway.

```yaml
- name: Run triage sweep
  if: steps.rate-check.outputs.skip != 'true'
  run: npx tsx src/jobs/issue-triage-sweep.ts
```

---

## Layer 3: Make Fewer Calls For The Same Information

The previous layers are about *managing* quota. This layer is about *needing less of it*.

### Replace REST Pagination With GraphQL

Our issue triage sweep was doing this:

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

In a repo with 200 open issues and 40 PRs, that's 2 pagination requests + 40 individual PR fetches = **42 API calls** just to build the issue list.

The GraphQL equivalent is **one request**:

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

One request per 100 items. No N+1 fetches for PR details. For a repo with 200 issues: **2 GraphQL requests** vs **42 REST calls**. A ~95% reduction.

> **Important:** Always use `octokit.request()` for REST calls, not `octokit.rest.*`. In Octokit v16+, the `.rest.*` namespace generates additional overhead. GraphQL calls go through `octokit.graphql()`.

### ETag Conditional GETs

GitHub's REST API supports [conditional requests](https://docs.github.com/en/rest/overview/resources-in-the-rest-api#conditional-requests). If you include an `If-None-Match` header with the ETag from your last fetch, GitHub returns **HTTP 304 Not Modified** when the data hasn't changed.

A 304 response is essentially free — it doesn't count against your rate limit in the same way, returns no body, and resolves in milliseconds.

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

Store the ETags in a file, persist the file via `actions/cache`, and every subsequent workflow run that fetches unchanged data gets a free 304.

This is especially effective for things like repo metadata, CODEOWNERS files, and label lists — data that changes rarely but gets fetched constantly.

### Cross-Workflow Deduplication Cache

When five different workflows all start within 10 minutes of each other, they each independently fetch the same "list of open issues" or "list of recent PRs." They're all making identical API calls.

The fix: a shared daily snapshot cache. The first workflow to run fetches and caches. Subsequent workflows read the cache instead of the API.

```yaml
- name: Restore API snapshot cache
  uses: actions/cache@v4
  with:
    path: .cache/api-snapshot.json
    key: api-snapshot-${{ github.repository }}-${{ env.DATE }}
    restore-keys: api-snapshot-${{ github.repository }}-
```

One fetch per day, shared across all workflows. The cache hit rate in a busy repo is extremely high.

---

## Layer 4: Runtime Enforcement — The Rate Governor

All the previous layers are **preventive**. They reduce the probability of hitting rate limits. But probability isn't certainty — you still need a runtime safety net for when things go sideways.

We built a **Rate Governor** — a 6-pattern in-process rate limiter that wraps all outbound GitHub API calls.

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

The key insight is **graduated response**. Rather than binary allow/block, the Rate Governor changes behavior as quota decreases:

- **GREEN** (> 60% remaining): full speed, all requests pass
- **YELLOW** (20–60% remaining): low-priority requests throttled, normal requests proceed
- **RED** (< 20% remaining): only P0 (critical) requests pass; P1 and P2 queue for retry

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

The `recordResponse()` call is critical — it reads the `X-RateLimit-Remaining` header from GitHub's response and updates the governor's state in real time. The governor knows the actual remaining budget, not just an estimate.

If a request gets a 429, `record429()` triggers immediate circuit breaker activation and exponential backoff.

---

## Putting It Together: The Five-Layer Defense

```
Layer 0: Identity     — GitHub App tokens (15K/hr, separate from human quota)
Layer 1: Scheduling   — Staggered crons + concurrency groups (no pile-ons)
Layer 2: Pre-flight   — Rate budget check at workflow start (abort early)
Layer 3: Efficiency   — GraphQL, ETags, shared cache (fewer calls needed)
Layer 4: Runtime      — Rate Governor with traffic light + circuit breaker
```

Each layer catches what the layer above it misses. A quota-efficient GraphQL query (Layer 3) still gets pre-checked (Layer 2) and runtime-governed (Layer 4). A staggered schedule (Layer 1) still has an emergency abort (Layer 2). A GitHub App identity (Layer 0) still gets managed by all the other layers.

The result: we went from hitting the rate limit wall every morning to running comfortably with dozens of agent workflows active, across multiple repos, with headroom to spare.

---

## The Deeper Lesson: Agent Scaling Is Different From Human Scaling

When a human developer uses the GitHub API, they make requests sequentially, with natural thinking time between them. The rate limit was designed for this pattern.

When agents use the GitHub API, they make requests in parallel, on schedules, in response to webhooks, and in coordinated bursts. The rate limit was not designed for this pattern.

As your team adopts agentic workflows — more AI-assisted PR reviews, more automated triage, more multi-agent coordination — you will hit this wall. The question is whether you hit it reactively (debugging mysterious 403s at 9am) or proactively (building the five-layer system before you need it).

The good news: the fixes are well-understood and composable. You don't need to implement all five layers at once. Start with Layer 0 (GitHub App identity) and Layer 1 (staggered schedules + concurrency groups). Those two changes alone will buy you significant headroom. Add the other layers as your agent footprint grows.

---

## Key Takeaways

1. **Use GitHub App tokens, not human identity, for all agent/automation work.** 15K req/hr vs 5K, and your agents stop competing with your developers.

2. **Stagger your scheduled workflows.** Never run more than one bulk workflow at the same cron time. Add 30–60 minutes of offset between each.

3. **Add concurrency groups to every scheduled workflow.** `cancel-in-progress: true` prevents parallel pile-ons from a slow run.

4. **Pre-check rate budget at the start of every bulk workflow.** Abort gracefully at < 300 remaining. Fail open (permissive default) if the check itself fails.

5. **Use GraphQL for list operations.** A single GraphQL query replacing N+1 REST calls is often a 10–50× reduction in API usage.

6. **Implement ETag caching for frequently-read, rarely-changed data.** 304 Not Modified is essentially free.

7. **Build a runtime governor.** Pre-flight checks are necessary but not sufficient. Wire `X-RateLimit-Remaining` feedback into your in-process rate limiting so your agents respond to reality, not estimates.

8. **Think about rate limits as a shared resource.** In a multi-agent system, every agent is spending from the same budget. Design them to cooperate, not compete.

---

*AgentCraftworks is an open-source GitHub App for governing and orchestrating AI agents. The Rate Governor, ETag cache, and workflow patterns described in this post are all available in the [AgentCraftworks repository](https://github.com/AgentCraftworks/AgentCraftworks) under MIT license.*
