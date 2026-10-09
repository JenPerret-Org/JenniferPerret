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

GitHub's REST API generally gives authenticated users 5,000 requests per hour, with different limits for some authentication methods and endpoints. That is a lot, for a human. It is almost nothing once you have agents. My issue triage sweep scanned every open issue, fetched labels, hunted duplicates, checked PR state — two to four hundred calls per run. The CI coach read workflow logs, fetched annotations, posted comments: another fifty to a hundred per failure. The review responder read diffs and fetched CODEOWNERS. The standup report aggregated across repos. The link checker fetched every URL in the docs, unbounded, because I had never once asked myself how many URLs were in the docs.

Now schedule all of them at 9am and watch them race to spend the whole budget before the first coffee. Everything afterward gets a 403 for the next forty-five minutes.

That is the agentic scaling wall, and it arrives the moment you cross from "a few automations" to "agents running the workflow."

Here is the part I am most sheepish about, because it wasn't clever at all.

The important distinction is the credential behind the variable. A personal access token spends from the user's quota. The built-in Actions `GITHUB_TOKEN` does not: its normal REST limit is 1,000 requests per hour per repository, or 15,000 for resources belonging to a GitHub Enterprise Cloud account. Calling a variable `GITHUB_TOKEN` doesn't tell you which credential it contains. Before blaming one very caffeinated developer, I need the workflow's token configuration and response headers.

A GitHub App installation token separates machine work from a user's quota. Its REST budget starts at 5,000 requests per hour; eligible non-Enterprise installations can scale up to 12,500, and installations on GitHub Enterprise Cloud organizations get 15,000. An App user token is different again: it shares the user's budget. The authentication method matters more than the logo.

```yaml
- name: Generate App token
  id: app-token
  uses: actions/create-github-app-token@v3
  with:
    app-id: ${{ secrets.GH_APP_ID }}
    private-key: ${{ secrets.GH_APP_PRIVATE_KEY }}

- name: Do agent work
  env:
    GH_TOKEN: ${{ steps.app-token.outputs.token }}
  run: gh api rate_limit --jq '.resources.core'
```

An installation token can give automation a separate budget, and sometimes a larger one. It does not automatically triple capacity. Even fifteen thousand requests an hour can run out if you have no opinion about how you spend them.

So I looked at *when* the agents ran. Putting several workflows on the same cron schedule creates a pile-on. For example, `0 9 * * *` means 09:00 UTC by default, not 9am Seattle time; local-time schedules need an explicit supported timezone configuration. The exact schedule and request spike need to come from the workflow history, not from my recollection of when I noticed the failures.

Staggering the crons sounds painfully obvious written down. It was not obvious when each workflow was added one at a time, on different days, each one perfectly reasonable on its own. Nobody sits down and designs a pile-on. You assemble one, cheerfully, over about six weeks.

I spread them across the morning and added concurrency groups to all twenty-one workflows, so a slow run cancels rather than stacking on top of the next trigger. Two copies of the same sweep racing each other is the kind of waste that only shows up in aggregate, which is to say it never shows up until you go looking.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

Even so, bad days happen. Webhook floods. A giant PR touching hundreds of files. A dependency update rippling across every repo. The outcome I feared most was an important workflow — diagnosing a CI failure during a real incident — getting a 403 because the link checker had cheerfully spent the last two hundred requests validating a footnote.

The budget check is meant to make bulk work stand down while there's still room for a webhook handler or a PR comment. Three hundred remaining requests is a proposed reserve, not a GitHub requirement or a guarantee that it covers every sweep. If the check fails, an unknown balance is not a full balance. Bulk work should defer or use a bounded, observable fallback, while critical work follows an explicit policy and still honors rate-limit responses. Every subsequent step also needs to gate on the result, which sounds too obvious to say out loud until you see a pre-check that politely warns and then runs the work anyway.

All of that manages consumption. The bigger win was needing less of it, and that is where I had to look at my own code and wince.

Fetching a list and then making a separate request for every item can turn a small sweep into dozens of calls. GraphQL can retrieve related fields together and reduce round trips. But the exact saving depends on the query, pagination, and fields the REST response already includes. GraphQL also has a separate points-based primary budget and shares secondary limits with REST. Fewer HTTP calls is not automatically less quota.

ETags offer another saving. For supported endpoints, send `If-None-Match` with the ETag from your last fetch. If the representation hasn't changed, GitHub can return `304 Not Modified`. Correctly authorized conditional requests that receive a 304 do not count against the primary rate limit. They still make a request, so secondary limits and concurrency discipline still matter. Persistent cache storage can retain the ETags between runs; it isn't a promise that every fetch becomes free.

Then cross-workflow deduplication, because five workflows starting within ten minutes of each other were each independently fetching the same list of open issues. Identical calls, five times over. Now the first one to run caches a daily snapshot and the rest read from it.

The last layer is the one that runs when everything above has already failed: a rate governor wrapping every outbound call. It is a token bucket that pays attention. Before a call goes out, the governor checks not just its local bucket but the actual `X-RateLimit-Remaining` value from the last response, so it tracks reality rather than a model of reality. Above sixty percent remaining, everything runs full speed. Between twenty and sixty, low-priority work gets throttled while normal work proceeds. Below twenty, only critical requests pass and the rest queue for retry.

Underneath that sits a circuit breaker. When a call fails with a rate limit error, the breaker trips for that endpoint and reports to the orchestrator. If enough endpoints trip at once, the orchestrator does not crash the squad — it checkpoints the work in progress and schedules a resume. The difference between "the agent died because it hit a rate limit" and "the squad paused for four minutes and picked up where it left off" is entirely in that decision. Most systems get the first behavior by default.

The last thing I added was visibility, and I only added it because I kept asking "why did the squad stall at 2pm yesterday?" and not being able to answer without an hour in the logs. Rate limit history charts in the [Hub](https://github.com/AgentCraftworks/AgentCraftworks-Hub) made consumption legible: when it spiked, which workflows were running, which agent behaviors were expensive. That turned rate limits from a debugging problem into a capacity planning one. The wall is still there. We just see it coming now.

Which brings me to why I am writing this down now rather than six months ago.

GitHub [published a changelog entry on April 10](https://github.blog/changelog/2026-04-10-enforcing-new-limits-and-retiring-opus-4-6-fast-from-copilot-pro/) announcing service-reliability and model-capacity limits rolling out over the following weeks, retiring Opus 4.6 Fast for Pro+ users, and recommending that requests be distributed rather than sent in concentrated waves.

My reaction was not surprise. It was recognition. I had been hitting those walls for months. I just thought they were bugs.

GitHub cited high concurrency, intense usage, shared infrastructure strain, and a decision to focus resources on the models people use most. It did not establish that agent squads specifically caused this retirement, or that Fast was the cheapest tier. Copilot's model limits are also not the REST API quota I had been investigating. The shared lesson is pacing, not a shared counter.

Here is the part I keep sitting with.

When I use the GitHub API interactively, there is often thinking time between requests. That was the rhythm I had in mind when I added the automations, one at a time. Agents call in parallel, on schedules, in response to webhooks, in coordinated bursts. GitHub has primary and secondary limits for that traffic; I had not designed my work to respect both. My instinct — the same drive to results that has always been my workhorse, the one that asks *can I make it go faster* — was precisely what built the pile-on.

You don't need all five layers on day one. App identity and staggered schedules with concurrency groups buy back most of the room. The rest can follow as your agent footprint grows. But the mindset shift has to come first: in a multi-agent system, agents using the same credential or installation may spend from the same budget. They are not independent. They are roommates sharing a bank account, and none of them can see the balance.

I built all of this because I was too busy shipping to notice my own agents were fighting each other.

So the real question for all of us is not whether we hit this wall. It is what else our agents are quietly competing over right now — and whether we will see it before 9am tomorrow.

---

*The rate governor, ETag cache, and workflow patterns in this letter are part of [AgentCraftworks](https://github.com/AgentCraftworks/AgentCraftworks), which I am open-sourcing in phases. Subscribe to follow along with the weekly letters documenting every step of the build.*
