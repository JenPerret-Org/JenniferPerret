---
title: "JenniferPerret.com: Why I'm Writing This in Public"
description: "After 10 months of building, breaking, and learning — I'm finally sharing the journey. Here's why public learning matters, especially now."
pubDate: 2026-04-04
tags: ["meta", "learning-in-public", "growth-mindset", "newsletter", "community"]
pillar: "ai-general"
draft: true
---

This is letter number sixteen. The first fifteen were backfill — written after the fact, reconstructing months of building from commit logs, pull requests, and memory. Starting now, these letters happen in real time.

I want to tell you why that matters, and why I am writing any of this in public at all.

## The Speed of This Transition

The AI agentic transition is moving too fast to learn alone.

I do not mean that as hyperbole. I mean it literally. The tooling changes weekly. The best practices from January are outdated by March. The patterns that work for one model provider break on another. The governance frameworks that enterprises need do not exist yet, and by the time a standards body publishes guidance, three generations of agent architectures will have come and gone.

Nobody has this figured out. Not the big tech companies, not the startups, not the researchers. We are all learning as we go. The difference is that most people are learning in private — inside corporate walls, behind NDAs, in Slack channels that disappear.

I decided to learn in public.

## Things Are About to Get Messy

The tagline on this site — "Things are about to get messy" — is not a warning. It is a promise.

Messy is where learning happens. Clean narratives are for case studies written after the outcome is known. I do not know the outcome yet. I am building an enterprise governance platform for AI agents, and some days it works beautifully and some days the Windows file system throws EPERM errors at me for six hours. Both days are worth writing about.

The growth mindset is not about believing you will succeed. It is about believing that the process of trying — including the failures, especially the failures — makes you better. Every revert taught me more than every merge. Every killed architecture taught me more than every shipping one.

I killed an entire .NET stack before landing on TypeScript. That decision — and the weeks of work I threw away to make it — taught me more about platform architecture than any of the code I kept.

## The Journey So Far

Let me put some numbers on this so you understand the scale.

I started in May of 2025. It was a Hello World. I had not written code in decades. I was a Microsoft veteran who had spent years on the business side, and the last time I had shipped software, we were still arguing about whether XML or JSON was the future.

Ten months later: over 3,000 commits across 10 repositories. An enterprise governance platform with NIST SP 800-53 and ISO 42001 compliance frameworks implemented as code. An Electron dashboard. A Go-based terminal session manager. A video production pipeline. A website. Six enterprise sprints shipped in 48 hours.

I am not saying this to impress you. I am saying this because it would have been impossible without AI agents — and it would have been impossible without the willingness to be messy in public.

## The Three Pillars

Everything I write falls into one of three categories. I think of them as pillars because they hold up the same roof, even though they look different from the ground.

### Agents Writing Code

This is the primary. This is the one nobody else is answering well.

When an AI agent writes code, who is responsible for it? When that code gets committed, reviewed, merged, deployed — what is the supply chain governance story? We have spent decades building software supply chain security practices, and agents are about to route around all of them unless we build governance into the agentic layer itself.

This is what AgentCraftworks exists to solve. These letters document the building of that solution.

### Building Agentic Solutions

This is the engineering pillar. Rate governors, circuit breakers, cascade detectors, scope isolation, TTL-based pruning, orchestration patterns for multi-agent squads. The nuts and bolts of making agent systems that are reliable, observable, and governable.

If you are an engineer building with agents, this pillar is where you will find patterns you can steal. I write about what works, what does not, and why.

### AI: The Bigger Picture

This is the context pillar. Where is all of this heading? What does the agentic transition mean for enterprises, for developers, for the way we think about software? I do not have answers. I have informed opinions, shaped by building in this space every day.

The bigger picture matters because it is easy to get lost in implementation details and forget why any of it matters. These letters pull back to the wide view.

## What I Have Learned About Learning

Ten months of building with AI agents has taught me something I did not expect: the misadventures are more valuable than the adventures.

When everything works, you learn that your plan was correct. That is satisfying but not educational. When something breaks — when the .NET stack has to be killed, when the EPERM bug eats six hours, when you commit the same sprint on two different branches and have to untangle the merge — that is when you learn how things actually work.

The revert teaches you more than the merge. The bug teaches you more than the feature. The deleted code teaches you more than the shipped code.

I have also learned that AI agents are extraordinary amplifiers and terrible decision-makers. They can generate code at a pace that is genuinely shocking. They cannot tell you whether that code should exist. The judgment — what to build, why to build it, whether it serves the mission — that remains stubbornly, irreducibly human.

## The Context for All This Intensity

If you have been reading these letters and wondering why the pace has been so relentless, there is context: the Agentic AI Hackathon, with judging extended to April 3. The sprint intensity of the last few weeks has been driven partly by that deadline and partly by the natural momentum of a platform that is reaching the point where its pieces fit together.

After April 3, the pace will change. Not slower, but different. Less sprinting, more deliberate building. The foundation is laid. Now we build on it.

## Come Along

Here is my invitation: follow along.

These letters will come weekly from here on out. They will cover specific governance patterns in depth — how the cascade detector works, why scope isolation matters for multi-tenant agent systems, what a compliance-as-code framework actually looks like in practice. They will cover the bigger questions too — where the agentic transition is heading, what enterprises should be thinking about, what keeps me up at night.

If you are building with AI agents, I want to hear about your messy journey too. The whole point of learning in public is that it is not a solo activity. It is a conversation.

## What Is Coming Next

Weekly letters, every Friday. Deeper dives into specific governance patterns — the rate governor architecture, the compliance framework design, the Hub dashboard evolution. Open-source contributions as pieces of the platform stabilize enough to share.

And eventually — soon — the platform itself, available for other teams building agent systems who need the governance layer we have been constructing these past ten months.

Things are about to get messy. That is the whole point. The mess is where the learning lives, and I would rather learn in public with you than in private by myself.

Let us get messy together.

---

*Subscribe to get these letters weekly. No spam, no fluff — just the real story of building enterprise AI governance, adventures and misadventures included.*
