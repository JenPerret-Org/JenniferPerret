---
title: "When the API Says No: Managing GitHub Rate Limits in an Agentic World"
description: "GitHub is now enforcing new Copilot rate limits. Here's what hitting those walls looks like when you have a squad of AI agents running, and what I built to survive it."
pubDate: 2026-04-18
tags: ["rate-limits", "github-api", "building-agents", "circuit-breakers", "rate-governor", "reliability"]
pillar: "building-agents"
draft: true
---

Last week, GitHub published [a changelog entry](https://github.blog/changelog/2026-04-10-enforcing-new-limits-and-retiring-opus-4-6-fast-from-copilot-pro/) that every developer building with AI agents needs to read. The short version: Copilot rate limits are now being actively enforced, Opus 4.6 Fast is being retired for Copilot Pro+ users, and GitHub is asking everyone to distribute requests more evenly over time rather than sending them in large, concentrated waves.

My reaction when I read it was not surprise. It was recognition.

I have been hitting these walls for months. I just did not know they were walls yet. I thought they were bugs.

## What "Rate Limited by an Agent Squad" Actually Looks Like

When a single developer hits a rate limit, the experience is simple. You get a 429. You wait. You retry. Life continues.

When a squad of AI agents hits a rate limit, the experience is something else entirely.

It starts subtly. One agent in the squad gets a 429 on a GitHub API call — say, fetching the current status of a pull request. That agent pauses and schedules a retry. Meanwhile, the other agents in the squad continue working. Some of them happen to call the same API endpoint. They also get 429s. Now three agents are in retry backoff simultaneously.

The orchestrator is watching all of this and decides the squad is degraded. It escalates. The escalation triggers more API calls — checking audit logs, pulling billing data, validating governance state. More 429s. The orchestrator now thinks something is seriously wrong, because every signal it queries is returning errors.

At this point, depending on how your error handling is wired, one of two things happens. Either the cascade detector kicks in and shuts the squad down gracefully — which is what you want — or the agents start spinning up retry loops that hammer the rate-limited endpoints harder, which is the exact opposite of what you want.

I experienced both outcomes before I understood what was causing them.

## The Diagnosis

Rate limit errors have a particular signature in the GitHub API: HTTP 403 with a `X-RateLimit-Remaining: 0` header, or HTTP 429 with a `Retry-After` header. But when you are running agents asynchronously and errors are aggregated by an orchestrator, those headers get lost. What surfaces in your logs is not "rate limited" — it's "governance state validation failed" or "audit poll returned unexpected status" or, my personal favorite, a completely silent failure where the agent just stops updating state.

The diagnosis required adding structured logging at the HTTP layer — logging not just the response code but the rate limit headers on every outbound GitHub API call. Once I could see the actual header values, the pattern was immediate: we were burning through 5,000 requests in about forty minutes every time a full squad run kicked off, then sitting in a rate-limited state for the remainder of the hour.

Five thousand requests in forty minutes from a squad of agents is not pathological. It is actually pretty normal if each agent is doing routine work — checking PR status, reading file contents, posting review comments, triggering workflow dispatches. The problem is that "normal agent work" at squad scale adds up faster than intuition suggests.

## The Rate Governor

This is where the [AgentCraftworks Hub](https://github.com/AgentCraftworks/Hub) rate governor came from. I have mentioned it in passing in previous letters, but the mechanics are worth detailing.

The rate governor is a token bucket with a twist. The token bucket is standard: you get N requests per window, each call consumes one token, and tokens refill on a schedule. What makes ours different is that it is *quota-aware*.

Before an agent makes an outbound GitHub API call, it queries the rate governor for a token. The rate governor does not just check the local bucket — it also checks the current `X-RateLimit-Remaining` value from the last successful API response. If remaining capacity is below a configurable threshold (we use 20% of the hourly limit as the warning threshold and 5% as the circuit breaker threshold), the rate governor starts throttling requests regardless of local bucket state.

This means the rate governor adapts to reality, not just to a theoretical model of how many requests we think we will make. If GitHub's API is telling us we have 50 requests left in the current window, we act like we have 50 requests left — not the 800 our local model predicted.

## Circuit Breakers for Cascade Prevention

The rate governor handles steady-state throttling. The circuit breaker handles the failure case.

When a call fails with a rate limit error, the circuit breaker trips for that endpoint. The circuit breaker state has three positions: closed (normal operation), open (failing fast, no calls going through), and half-open (testing recovery). Tripped circuit breakers report their status to the orchestrator through a shared health channel.

The orchestrator aggregates circuit breaker states across the squad. If more than a configurable percentage of endpoints are tripped simultaneously, it initiates a *controlled squad pause* — not a crash, not an error state, but a deliberate pause with a scheduled resume. The squad is told to hold, the work-in-progress is checkpointed, and the orchestrator waits for the circuit breakers to recover before resuming.

This is the difference between "the agent crashed because it hit a rate limit" and "the squad paused for four minutes and then continued where it left off." The second experience is what you want. The first is what most people have by default.

## The Hub Dashboard

One of the first features I added to [AgentCraftworks Hub](https://github.com/AgentCraftworks/Hub) was rate limit history charts — not just the current remaining count, but a time-series view of consumption over the past 24 hours. I added it because I kept asking "why did the squad stall at 2pm yesterday?" and not being able to answer it without digging through logs.

The charts make the answer obvious. You can see exactly when consumption spiked, correlate it with which workflows were running, and identify the specific agent behaviors that burned the most quota. That visibility turned rate limit management from reactive debugging into proactive capacity planning.

Now when I look at the Hub and see the consumption curve heading toward the circuit breaker threshold, I can manually pause a squad run or adjust the request scheduling before we hit the wall. The wall is still there. We just see it coming now.

## What GitHub's New Limits Mean for Agent Builders

The [changelog entry](https://github.blog/changelog/2026-04-10-enforcing-new-limits-and-retiring-opus-4-6-fast-from-copilot-pro/) distinguishes between two types of limits going forward:

**Service reliability limits** are the ones where you hit a ceiling and have to wait for your session to reset. These are the hard stops. No retry will help — you wait for the window to clear.

**Model and model family capacity limits** are softer — when you hit these, the guidance is to switch to an alternative model. This is actually a useful signal for agent systems: if you are writing agent orchestration code, you should already have a model fallback chain. If Opus 4.6 Fast is at capacity, route to Opus 4.6. If that is constrained, route to Sonnet. The hierarchy should be explicit in your configuration.

The retirement of Opus 4.6 Fast for Copilot Pro+ is a separate signal worth naming: the fastest, cheapest tier of a powerful model is going away because it was being concentrated-burst in ways that put load on shared infrastructure. That is agent usage. That is exactly the pattern I described above — squads making lots of calls in short windows. The retirement is a consequence of that usage pattern at scale.

For teams that were using Opus 4.6 Fast for rapid agent loops specifically because of its speed: you need a fallback now. Opus 4.6 is the recommended alternative. It's slightly slower and slightly more expensive per call, which means the economic pressure to spread requests over time actually increases, not decreases.

## Practical Recommendations

If you are building agentic systems that use the GitHub API or Copilot models, here is what I would recommend based on months of running into this:

**Instrument at the HTTP layer.** Log rate limit headers on every outbound API call. You cannot manage what you cannot see. A 403 or 429 without the accompanying headers is an incomplete error.

**Build a rate governor, not just retry logic.** Retry logic tells you what to do when you hit a limit. A rate governor tells you how not to hit it in the first place. The two are complementary but the governor is more valuable.

**Configure circuit breakers with squad-level awareness.** Individual agent circuit breakers are good. Orchestrator-level aggregation that can pause a whole squad is better. Rate limit errors are correlated — when one agent gets them, others likely will too.

**Use the model fallback chain.** Explicit fallback from fastest model to progressively more conservative models is table stakes for production agent systems. With Opus 4.6 Fast retiring, those chains need updating today.

**Plan for the shape of your consumption, not just the ceiling.** The 5,000 requests per hour limit is not your constraint. The constraint is that 5,000 requests in 40 minutes followed by 20 minutes of silence is a pattern that harms reliability for you and for everyone sharing the infrastructure. Smooth consumption is better consumption.

## The Broader Point

GitHub's announcement is not punitive. It's honest. Shared infrastructure has real limits, and concentrated bursts of high-volume usage — exactly the kind that agent squads produce by default — stress the systems that everyone depends on.

The agentic transition is not going to slow down because of rate limits. But the builders who thrive in this environment are going to be the ones who design *with* limits in mind rather than discovering them at 2am when a critical agent run grinds to a halt.

Rate governors, circuit breakers, consumption visibility, model fallback chains — these are not nice-to-haves for production agent systems. They are the infrastructure that makes agents reliable. The wall was always there. Now GitHub is making it official.

Build the guardrails before you hit the wall. The wall has a schedule now.

---

*Want to see the rate governor and circuit breaker implementations? They're part of the AgentCraftworks platform, which I am working toward open-sourcing in phases. Subscribe to get notified when pieces become available — and follow along with the weekly letters documenting every step of this build.*
