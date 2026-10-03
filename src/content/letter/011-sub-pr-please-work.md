---
title: "sub-pr-107-please-work: What Copilot Taught Me About Agent Governance"
description: "60+ automated Copilot fix attempts. Branch names escalating to '-please-work'. The supply chain governance problem made visceral in my own repo."
pubDate: 2026-03-03
tags: ["copilot", "agent-governance", "supply-chain", "irony", "real-world"]
pillar: "agents-coding"
draft: true
---

## The Irony Wasn't Lost On Me

Picture this. It's early March 2026. I am building an enterprise governance platform whose entire purpose is to ensure AI agents operate within defined guardrails.

And in my own repository, an ungoverned Copilot agent is flooding my pull request queue with failed fix attempts, and there is nothing stopping it.

This is the story of sub-pr-107-please-work.

It started innocuously enough. GitHub's code scanning flagged an issue. Copilot, being helpful, opened a pull request with a potential fix. The commit message was clean, clinical: "Potential fix for code scanning alert."

The fix didn't work.

So Copilot tried again. Same clinical message. Same failed approach. And again. And again.

Over the course of a few weeks, Copilot generated more than sixty automated fix attempts against my repository. The vast majority did not resolve the underlying issue. Some introduced new problems. A few were so far off base that reviewing them was a net negative: time I could have spent fixing the problem, instead spent parsing a machine's confident-but-wrong suggestion.

The branch names told the emotional arc better than I could: `copilot/sub-pr-107`, then `sub-pr-107-again`, `sub-pr-107-another-one`, `sub-pr-107-yet-again`, `sub-pr-107-please-work`, `sub-pr-107-one-more-time`.

If you've ever named a branch "please-work," you know exactly where my head was. That's not engineering. That's negotiation. That's a human being bargaining with an automated system that has no concept of your frustration and no mechanism to learn from its own repeated failures.

Let me be precise about the failure mode, because it matters.

Copilot was responding to code scanning alerts, legitimate security findings that needed attention. The intent was good. The mechanism was sound in theory: detect a problem, propose a fix, submit it for review.

But the agent had no awareness of its own track record. It didn't know that its previous seven attempts at this same fix had all failed. It didn't have a feedback loop that said "my confidence in this fix type is low, maybe I should escalate to a human instead of trying again." It didn't have a rate limit that said "I've submitted five failed PRs for this issue, time to stop and flag this for manual intervention."

It kept going. High volume, low success rate, flooding the queue.

This is what ungoverned agent behavior looks like in practice. Not malice. Not some dramatic AI safety scenario. Just a well-intentioned system operating without the constraints it needs to be genuinely useful.

The comedy deepens when you see what else was happening in my repos during this same period.

I was building demo videos for AgentCraftworks. I was writing the governance framework documentation. I was deploying to Azure, and if you want another flavor of rapid-fire iteration, look at March 10th, where I pushed something like ten consecutive `azd` deployment fixes back to back because Azure deployment configuration is its own special form of suffering.

I was launching the website, polishing the hero section, adjusting pricing badges, wiring up the FAQ. I was doing all the things a solo founder does when she's trying to ship a product.

And through all of it, in the background, Copilot was quietly generating its sixty-first failed fix attempt, and my PR queue looked like a help desk ticket system for a particularly persistent robot.

I couldn't have designed a better demo of the problem I'm solving.

If I had gone to an enterprise customer and said "imagine an AI agent generating dozens of failed pull requests against your codebase, with no rate limiting, no quality gates, no escalation logic, and no way to distinguish its successful attempts from its unsuccessful ones," they'd nod politely and think I was being hypothetical.

It wasn't hypothetical. It was my Tuesday.

My own repository became the unplanned test case for everything AgentCraftworks is designed to prevent. The supply chain governance problem wasn't abstract anymore. It was sitting in my GitHub notifications, sixty messages deep, all with the same clinical commit message, all from the same automated system, most of them wrong.

This is where the lesson gets concrete.

A governed agent would have rate-limited itself: after three failed attempts at the same issue, it would pause and flag the issue as requiring human intervention instead of continuing to throw fixes at the wall. It would have had quality gates before submission, requiring that a proposed fix actually pass the relevant checks locally before opening a PR, not just "does it compile" but "does it resolve the specific alert it claims to fix." Every one of those sixty-plus commits had the same generic message; a governance framework would attach provenance metadata instead, which model version, which prompt chain, which scanning alert triggered it, what the agent's confidence score was. And it would have had escalation logic: a simple rule that if an agent has failed to fix the same issue more than N times, it stops trying and creates a human-readable summary of what was attempted and why it failed, turning the failure into useful information instead of more noise.

None of this is exotic technology. It's the kind of operational discipline we've applied to every other automated system in the enterprise software stack. We rate-limit API calls. We circuit-break failing services. We escalate alerts that auto-remediation can't handle.

We just haven't applied it to AI agents yet. And my PR queue was the evidence of what happens when we don't.

I'm telling this story with humor because the situation genuinely was funny. Watching branch names escalate from clinical precision to "please-work" is comedy. The irony of building governance software while your own repo is ungoverned is comedy.

But the underlying point is dead serious.

This was one developer, with one agent, on a small repository. Imagine this at enterprise scale. Imagine a hundred agents operating across a thousand repositories, each one generating fix attempts without rate limits, without quality gates, without escalation logic. Imagine trying to audit that. Imagine trying to find the three good fixes buried under the sixty bad ones. Imagine the developer time consumed just triaging the noise.

That's not a hypothetical future. That's where we're headed right now, at the speed enterprises are adopting AI-assisted development tooling.

The branch name "sub-pr-107-please-work" is funny. The problem it represents is not.

And yes, I am building the thing that would have prevented it. The irony sustains me. Has your own product ever built its case study for you, whether you asked for it or not?

---

*This is Letter 011 of a series about building AgentCraftworks in public. If you want to follow a founder who keeps accidentally creating the perfect case studies for her own product, subscribe to follow the journey.*
