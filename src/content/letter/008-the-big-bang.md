---
title: "The Big Bang: 6 Sprints, 2 Stacks, 1 Weekend"
description: "We scaffolded the entire AgentCraftworks platform in a single weekend — TypeScript AND .NET, with full agent team prompts. Then we had to live with the consequences."
pubDate: 2026-02-10
tags: ["sprint", "dual-stack", "TypeScript", "dotnet", "hackathon", "velocity"]
pillar: "building-agents"
draft: true
---

There is a particular kind of delusion that takes hold at 11 PM on a Friday night when you have a fresh repo, a clear vision, and absolutely no constraints. You think: I can build all of it. Both stacks. The whole thing. By Monday.

And then you do. And then you have to live with it.

## The Weekend That Started Everything

February 9, 2026. I opened two terminal windows, created two project scaffolds, and started typing. By Sunday night, AgentCraftworks existed — not as a slide deck or a design doc, but as running code. TypeScript on one side, .NET Aspire on the other. A dual-stack enterprise governance platform for AI agents, built in 48 hours by one person and a fleet of AI coding assistants.

I had spent twenty years at Microsoft. I knew what it took to stand up a platform. Months of design reviews. Weeks of architecture diagrams. Careful sequencing of dependencies. I threw all of that institutional knowledge out the window and just started building.

It felt incredible.

## What We Built in 48 Hours

The inventory from that weekend still slightly terrifies me. Across both stacks, we scaffolded:

**Core Services** — A Handoff Service for managing agent-to-human transfers. An Action Classifier that could categorize agent actions by risk level. An Autonomy Dial that controlled how much latitude an agent had. A CODEOWNERS parser that understood repository governance structures. A Permission Checker for authorization decisions.

All of it built twice. Once in TypeScript. Once in .NET.

**Agent Team Prompts** — Full persona definitions for a reviewer agent, a tester agent, and an architect agent. These weren't throwaway prompts. They had system instructions, tool access patterns, escalation rules. They were the beginning of what would become our multi-agent governance model.

**MCP Server** — A Model Context Protocol server with governance tools. This was the connective tissue — the thing that let AI coding assistants actually interact with the governance layer.

**Multi-Platform Support** — From day one, I wanted AgentCraftworks to work everywhere developers already worked. So we built integration points for Copilot, Cursor, Windsurf, Cline, and Google Gemini Code Assist. Five platforms. Weekend one.

Sprints 1, 2, and 3 were running in parallel for both stacks. I had branch names like `sprint1-ts`, `sprint1-dotnet`, `sprint2-ts`, and on and on. The commit graph from that weekend looks like a subway map designed by someone who had never seen a city.

## The AI Multiplier

Let me be direct about something: a single person cannot scaffold two full enterprise platform stacks in a weekend. Not without AI assistance. The velocity I experienced that weekend was only possible because I was pair-programming with AI agents across multiple tools simultaneously.

I would describe the architecture I wanted for the TypeScript handoff service, watch it materialize, then pivot to the .NET window and describe the equivalent patterns there. The agents understood dependency injection, understood middleware patterns, understood state machines. They could generate the boilerplate while I focused on the governance logic that made AgentCraftworks different from yet another agent framework.

This is the promise of AI-assisted development made real. Not replacing the developer, but amplifying one developer's vision across more surface area than any human could cover alone. I was designing, reviewing, correcting, and steering — but the raw output volume was something new entirely.

It was also, I would learn very soon, a way to create technical debt at a pace previously unknown to humanity. But we will get to that.

## The Dual-Stack Decision

In the moment, building both TypeScript and .NET felt strategic. Enterprise customers live in both worlds. Microsoft shops run .NET. Startups and the broader web ecosystem run TypeScript. The MCP specification itself was TypeScript-native, but .NET had Aspire for cloud-native orchestration. Why choose when you could serve both?

This reasoning was sound. It was also, in retrospect, a trap.

When you are one person and you build everything twice, you do not have two implementations. You have two things that are each half-maintained. Every bug fix needs to land in two places. Every design decision forks into two conversations. Every test suite doubles. The overhead is not 2x — it is something closer to 3x, because you also pay the cost of keeping the two stacks conceptually synchronized.

But on that Sunday night, riding the high of a weekend where I had gone from zero to a working dual-stack prototype, none of that math had hit yet. I pushed the last commit, looked at the branch graph, and felt the specific euphoria of shipping.

## The Foreshadowing

Here is what I did not know on February 10: within two weeks, I would kill the entire .NET stack.

Every line of C# I wrote that weekend, every Aspire configuration, every .NET test — all of it would be abandoned. Not because it was bad code. It worked. The .NET implementation was arguably cleaner in some areas, benefiting from stronger typing and the maturity of the ASP.NET middleware pipeline.

I killed it because focus matters more than coverage, and because shipping one thing well beats shipping two things that kind of work. But that lesson cost me a weekend of work and a fair amount of emotional attachment to code I was proud of.

## The Numbers

By Sunday night: 6 sprints planned, 2 full stacks scaffolded, agent team prompts written, MCP server running, multi-platform integration points stubbed out. The commit count was already climbing toward what would become 963 commits by month's end.

February 2026 was about to become the most intense month of my professional life. This weekend was the ignition event — the moment the project went from theoretical to real, from "I should build this" to "I am building this and it is alive and it has bugs and it needs tests and the CI is red and I love it."

Things were about to get messy. Gloriously, instructively, publicly messy.

---

*This is Letter 008 of "Things Are About to Get Messy," a series about building an enterprise AI governance platform in public. The adventure continues — and the misadventures are just getting started.*

*If you want to follow along as I learn (and break things) in real time, subscribe below.*
