---
title: "JenniferPerret.com: Why I'm Writing This in Public"
description: "After 10 months of building, breaking, and learning, I'm finally sharing the journey. Here's why public learning matters, especially now."
pubDate: 2026-04-04
tags: ["meta", "learning-in-public", "growth-mindset", "newsletter", "community"]
pillar: "ai-general"
draft: true
---

This is letter number sixteen. The first fifteen were backfill — written after the fact, reconstructed from commit logs, pull requests, and memory. Starting now, these happen in real time.

Which means starting now, I don't get to know how the story ends before I write it down.

The AI agentic transition is moving too fast to learn alone. I don't mean that as hyperbole. The tooling changes weekly. Best practices from January are stale by March. Patterns that work for one model provider break on another. The governance frameworks enterprises actually need do not exist yet, and by the time a standards body publishes guidance, three generations of agent architecture will have come and gone.

Nobody has this figured out. Not the big tech companies, not the startups, not the researchers. We are all learning as we go. The difference is that most of that learning happens in private — inside corporate walls, behind NDAs, in Slack channels that evaporate.

So I decided to do mine in public.

The tagline on this site, "things are about to get messy," isn't a warning. It's a promise. Messy is where the learning happens. Clean narratives are for case studies written after the outcome is known, and I don't know the outcome yet. Some days the platform works beautifully. Some days the Windows file system throws EPERM errors at me for six hours. Both days are worth writing about, though only one of them is fun.

A growth mindset isn't believing you'll succeed. It's believing that the process of trying — including, especially, the failures — makes you better. Every revert taught me more than every merge. Every killed architecture taught me more than every shipping one. I threw away an entire .NET stack before landing on TypeScript, and the weeks of work I burned to get there taught me more about platform architecture than any of the code I kept.

Some numbers, so the scale is clear. I started in May of 2025 with a Hello World. I had not written code in decades. I was a Microsoft veteran who had spent years on the business side, and the last time I shipped software we were still arguing about whether XML or JSON was the future.

Ten months later: over 3,000 commits across 10 repositories. An enterprise governance platform with NIST SP 800-53 and ISO 42001 compliance frameworks implemented as code. An Electron dashboard. A Go-based terminal session manager. A video production pipeline. A website. Six enterprise sprints shipped in 48 hours.

I'm not listing that to impress anyone. I'm listing it because none of it would have been possible without AI agents, and none of it would have been possible without a willingness to be messy in public.

Everything I write here falls into one of three pillars. They look different from the ground but they hold up the same roof.

The first is agents writing code, and it's the one nobody is answering well. When an AI agent writes code, who is responsible for it? When that code gets committed, reviewed, merged, deployed — what is the supply chain governance story? We spent decades building software supply chain security practices, and agents are about to route around every one of them unless we build governance into the agentic layer itself. That is what AgentCraftworks exists to solve, and these letters document the building of it.

The second is the engineering. Rate governors, circuit breakers, cascade detectors, scope isolation, TTL-based pruning, orchestration patterns for multi-agent squads. The nuts and bolts of making agent systems reliable, observable, and governable. If you're building with agents, this is the pillar where you'll find patterns worth stealing. I write about what works, what doesn't, and why.

The third is the wider view. Where is this heading? What does the agentic transition mean for enterprises, for developers, for how we think about software? I don't have answers. I have informed opinions, shaped by building in this space every day. The bigger picture matters because it is easy to get lost in implementation detail and forget why any of it is worth doing.

Ten months of this has taught me something I didn't expect: the misadventures are worth more than the adventures.

When everything works, you learn your plan was correct. Satisfying, not educational. When something breaks — when the .NET stack has to die, when the EPERM bug eats six hours, when you commit the same sprint on two different branches and spend an evening untangling the merge — that's when you learn how things actually work. The revert teaches more than the merge. The bug teaches more than the feature. The deleted code teaches more than the shipped code.

I've also learned that AI agents are extraordinary amplifiers and terrible decision-makers. They generate code at a pace that is genuinely shocking. They cannot tell you whether that code should exist. The judgment — what to build, why, whether it serves the mission — stays stubbornly, irreducibly human.

If the pace here has felt relentless, there's context: the Agentic AI Hackathon, with judging extended to April 3. The last few weeks were driven partly by that deadline and partly by the momentum of a platform finally reaching the point where its pieces fit together. After April 3 the pace changes. Not slower, different. Less sprinting, more deliberate building. The foundation is laid.

From here these letters come weekly. They'll go deep on specific governance patterns — how the cascade detector works, why scope isolation matters for multi-tenant agent systems, what compliance-as-code looks like in practice. They'll also pull back to the questions that keep me up at night. And as pieces of the platform stabilize enough to share, they'll become open source.

If you're building with agents, I want to hear about your messy journey too. The entire point of learning in public is that it isn't a solo activity. It's a conversation, and so far I've been doing most of the talking.

Things are about to get messy. What are you building that you're not ready to show anyone yet?

---

*Subscribe to get these letters weekly. No spam, no fluff, just the real story of building enterprise AI governance, adventures and misadventures included.*
