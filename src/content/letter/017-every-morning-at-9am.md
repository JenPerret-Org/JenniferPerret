---
title: "Every Morning at 9am: The Day I Learned My Agents Were Fighting Each Other"
description: "I built a platform to govern AI agents. Then my own agents quietly took each other down every morning for weeks, and I couldn't figure out why."
pubDate: 2026-04-18
tags: ["rate-limits", "github-api", "building-agents", "circuit-breakers", "rate-governor", "reliability"]
pillar: "building-agents"
draft: true
---

Every morning. Somewhere around 9am. Like clockwork.

My workflows would start failing. Nothing dramatic, nothing that pages you. Just quiet 403s. Issues going untriaged. PRs sitting unreviewed. CI failures piling up undiagnosed while I was in meetings assuming the machines had it handled.

I am building [AgentCraftworks](https://github.com/AgentCraftworks/AgentCraftworks), a governance and orchestration platform, so that enterprises can run AI agents on GitHub *safely*. And for the better part of a month, my own agents were thrashing the API and taking each other down before lunch, and I could not tell you why.

When I finally dug in, the answer was humbling in its simplicity. I had run out of GitHub API quota.

Not "hit an edge case." Not "discovered a subtle distributed systems problem." Ran out. Like forgetting to check the gas gauge.

The GitHub REST API gives each authenticated identity 5,000 requests per hour. That is a lot, for a human. It is almost nothing once you have agents. My issue triage sweep scanned every open issue, fetched labels, hunted duplicates, checked PR state — two to four hundred calls per run. The CI coach read workflow logs, fetched annotations, posted comments: another fifty to a hundred per failure. The review responder read diffs and fetched CODEOWNERS. The standup report aggregated across repos. The link checker fetched every URL in the docs, unbounded, because I had never once asked myself how many URLs were in the docs.

Now schedule all of them at 9am and watch them race to spend the whole budget before the first coffee. Everything afterward gets a 403 for the next forty-five minutes.

That is the agentic scaling wall, and it arrives the moment you cross from "a few automations" to "agents running the workflow."

Here is the part I am most sheepish about, because it wasn't clever at all.

Every single one of my workflows was authenticating as the same human identity. Mine. Every `GITHUB_TOKEN` was scoped to the repo but drawn from my personal quota. Every `gh` call in every script ran as me. I had a dozen agents doing machine work, and GitHub saw exactly one very caffeinated developer hammering the API.

The fix was to stop using human identity for machine work. GitHub Apps get their own bucket — fifteen thousand requests an hour, three times the personal limit, and critically, separate from any human's.

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

That one change tripled my budget. I would love to tell you it was enough. Fifteen thousand requests an hour still runs out if you have no opinion about how you spend them.

So I looked at *when* the agents ran, and the answer was: all at once. Every scheduled workflow was set to `0 9 * * *`. Nine o'clock. Every morning. Together. Seven hundred API calls in the first minute, on top of every webhook fired overnight, on top of Dependabot's morning PR batch.

Staggering the crons sounds painfully obvious written down. It was not obvious when each workflow was added one at a time, on different days, each one perfectly reasonable on its own. Nobody sits down and designs a pile-on. You assemble one, cheerfully, over about six weeks.

I spread them across the morning and added concurrency groups to all twenty-one workflows, so a slow run cancels rather than stacking on top of the next trigger. Two copies of the same sweep racing each other is the kind of waste that only shows up in aggregate, which is to say it never shows up until you go looking.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Even so, bad days happen. Webhook floods. A giant PR touching hundreds of files. A dependency update rippling across every repo. The outcome I feared most was an important workflow — diagnosing a CI failure during a real incident — getting a 403 because the link checker had cheerfully spent the last two hundred requests validating a footnote.

So every bulk workflow now checks its budget before it starts, and skips the run if fewer than three hundred requests remain. Three details in that check cost me something to learn. The fallback is permissive: if the budget check itself fails, it assumes full quota and proceeds, because a broken gauge should never ground the plane. The threshold is three hundred rather than zero, so there is still room for a webhook handler or a PR comment after the sweeps stand down. And every subsequent step actually gates on the result, which sounds too obvious to say out loud until the day you discover a pre-check that politely warns and then runs the work anyway.

All of that manages consumption. The bigger win was needing less of it, and that is where I had to look at my own code and wince.

My triage sweep paginated every open issue, then made a separate call for each PR to get its state. In a repo with two hundred issues and forty PRs, that is forty-two API calls just to build a list. The GraphQL equivalent gets the same data, PR state included inline, in two requests. Ninety-five percent fewer calls, from one query I had not bothered to write because the REST version already worked.

ETags were the next free win. Send an `If-None-Match` header with the ETag from your last fetch, and if nothing changed, GitHub returns a 304 with no body, resolved in milliseconds. Repo metadata, CODEOWNERS files, label lists — data that changes rarely and gets fetched constantly. Cache the ETags to disk, persist with `actions/cache`, and most of those fetches become free.

Then cross-workflow deduplication, because five workflows starting within ten minutes of each other were each independently fetching the same list of open issues. Identical calls, five times over. Now the first one to run caches a daily snapshot and the rest read from it.

The last layer is the one that runs when everything above has already failed: a rate governor wrapping every outbound call. It is a token bucket that pays attention. Before a call goes out, the governor checks not just its local bucket but the actual `X-RateLimit-Remaining` value from the last response, so it tracks reality rather than a model of reality. Above sixty percent remaining, everything runs full speed. Between twenty and sixty, low-priority work gets throttled while normal work proceeds. Below twenty, only critical requests pass and the rest queue for retry.

Underneath that sits a circuit breaker. When a call fails with a rate limit error, the breaker trips for that endpoint and reports to the orchestrator. If enough endpoints trip at once, the orchestrator does not crash the squad — it checkpoints the work in progress and schedules a resume. The difference between "the agent died because it hit a rate limit" and "the squad paused for four minutes and picked up where it left off" is entirely in that decision. Most systems get the first behavior by default.

The last thing I added was visibility, and I only added it because I kept asking "why did the squad stall at 2pm yesterday?" and not being able to answer without an hour in the logs. Rate limit history charts in the [Hub](https://github.com/AgentCraftworks/Hub) made consumption legible: when it spiked, which workflows were running, which agent behaviors were expensive. That turned rate limits from a debugging problem into a capacity planning one. The wall is still there. We just see it coming now.

Which brings me to why I am writing this down now rather than six months ago.

GitHub [published a changelog entry](https://github.blog/changelog/2026-04-10-enforcing-new-limits-and-retiring-opus-4-6-fast-from-copilot-pro/) this month announcing that Copilot rate limits are now actively enforced, that Opus 4.6 Fast is being retired for Pro+ users, and asking everyone to distribute requests more evenly rather than sending them in concentrated waves.

My reaction was not surprise. It was recognition. I had been hitting those walls for months. I just thought they were bugs.

And the retirement of the fastest, cheapest tier of a powerful model is worth naming plainly. It is going away because it was being burst in exactly the pattern I just described — squads making enormous numbers of calls in short windows. That is agent usage. That is us. The announcement is not punitive; it is honest. Shared infrastructure has real limits, and concentrated bursts stress the systems everyone depends on.

Here is the part I keep sitting with.

When a human uses the GitHub API, requests arrive one at a time with thinking time in between. The rate limit was designed for that rhythm. For us. Agents call in parallel, on schedules, in response to webhooks, in coordinated bursts, and the limit was never shaped for that. My instinct — the same drive to results that has always been my workhorse, the one that asks *can I make it go faster* — was precisely what built the pile-on.

You don't need all five layers on day one. App identity and staggered schedules with concurrency groups buy back most of the room. The rest can follow as your agent footprint grows. But the mindset shift has to come first: in a multi-agent system, every agent spends from the same budget. They are not independent. They are roommates sharing a bank account, and none of them can see the balance.

I built all of this because I was too busy shipping to notice my own agents were fighting each other.

So the real question for all of us is not whether we hit this wall. It is what else our agents are quietly competing over right now — and whether we will see it before 9am tomorrow.

---

*The rate governor, ETag cache, and workflow patterns in this letter are part of [AgentCraftworks](https://github.com/AgentCraftworks/AgentCraftworks), which I am open-sourcing in phases. Subscribe to follow along with the weekly letters documenting every step of the build.*
