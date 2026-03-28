---
title: "Killing the .NET Stack and Shipping the Community Edition"
description: "The hardest decision of the month: abandoning half of what we'd built. But shipping one thing well beats shipping two things half-done."
pubDate: 2026-02-24
tags: ["dotnet", "TypeScript", "community-edition", "open-source", "hard-decisions"]
pillar: "agents-coding"
draft: true
---

I spent a full weekend building the .NET implementation of AgentCraftworks. It worked. The middleware was clean, the dependency injection was elegant, the Aspire orchestration was genuinely impressive. And on February 20, I decided to kill all of it.

This letter is about that decision — why it was hard, why it was right, and what happened in the four days after when we shipped the Community Edition.

## The Case for Killing It

The technical argument was straightforward. The Model Context Protocol — the connective tissue that lets AI agents interact with governance tools — is a TypeScript-native specification. The MCP ecosystem, the reference implementations, the community tooling: all TypeScript. Every time I needed to implement an MCP feature in .NET, I was translating idioms across a language boundary, and those translations introduced friction and subtle bugs.

But the real argument was simpler than that: I am one person.

One person maintaining two full platform stacks is not "strategic coverage of the enterprise market." It is a slow-motion failure in both stacks simultaneously. Every hour I spent fixing `JsonElement` hash violations in .NET was an hour I was not shipping governance features in TypeScript. Every bug I fixed twice was a feature I did not build once.

The .NET code was not bad. Some of it was better than the TypeScript equivalent. The ASP.NET middleware pipeline for the permission checker was more composable than what I had in Express. The C# type system caught errors at compile time that TypeScript only caught at runtime.

None of that mattered. What mattered was focus. And focus meant choosing one stack and shipping it well.

## The Sunk Cost Conversation

I will be honest about something: I did not make this decision easily.

Twenty years at Microsoft means twenty years of thinking in C#. The .NET stack felt like home. The TypeScript stack felt like a vacation rental — functional, modern, but not quite mine. Killing .NET was not just a technical decision. It was letting go of the implementation that felt most natural to write.

There is a voice that shows up when you are about to abandon work you just completed. It says: but you already built it. It says: what about all those hours? It says: maybe you can maintain both if you just try harder.

That voice is the sunk cost fallacy wearing a project manager costume. The hours are spent whether you keep the code or not. The only question that matters is: going forward, what is the best use of the next hour? And the answer was unambiguous. The next hour should go toward shipping TypeScript.

I archived the .NET code. I did not delete it — I am not that brave. But I stopped maintaining it, stopped fixing its bugs, stopped pretending I could serve two masters.

## Four Days, 70 Commits

February 24, 2026. The AgentCraftworks-CE repository was born. CE for Community Edition — the open-source version of the governance platform, TypeScript-only, focused and shippable.

In four days, we pushed 70 commits. Not scaffolding commits this time. Shipping commits. Real features, tested, documented, ready for other developers to use.

### What Shipped

**Core Libraries** — Type definitions for the entire governance model. The handoff state machine (the clean 4-state version that survived stabilization hell). A CODEOWNERS parser that actually understood the full GitHub syntax. Auth utilities for token validation and scope checking.

**Services** — The action classifier for categorizing agent operations by risk level. The autonomy dial (5-level engagement model — the version that made sense). A context service for maintaining governance state across agent interactions. The handoff service for agent-to-human transfers. Permission checker middleware. Webhook signature verification middleware.

**Integration Layer** — A PR handler for governance-aware pull request workflows. Autonomy dial API routes for runtime configuration. An MCP server with 6 governance tools that any compatible AI assistant could call.

**Community Infrastructure** — This is the part that takes a project from "code on GitHub" to "actual open-source project." README with architecture diagrams and quickstart instructions. CONTRIBUTING guide with development workflow. CODE_OF_CONDUCT. SECURITY policy with vulnerability reporting process. LICENSE (MIT). AGENTS.md — a file I am particularly proud of, documenting how AI agents should interact with the codebase.

**CI/CD** — GitHub Actions workflow for build, test, and lint. The kind of pipeline that catches the problems before they reach main.

### Product Thinking

We also shipped something that does not live in the codebase: a pricing proposal and engagement model documentation. Because a Community Edition implies an Enterprise Edition, and an Enterprise Edition requires a business model.

This was a deliberate choice — thinking about product and business alongside the code, not after it. Too many open-source projects ship beautiful code with no sustainability story. I wanted AgentCraftworks-CE to be useful to the community AND to be the foundation of something that could sustain ongoing development.

### Deployment Infrastructure

Azure OIDC federation for secure CI/CD authentication. A staging deployment pipeline. Self-contained agent instructions so that AI coding assistants could work on the codebase without external context. The kind of operational foundation that turns a repository into a platform.

## The Emotional Reality

I want to talk about what it actually feels like to delete working code you wrote three weeks ago, because I think we do not talk about this enough in engineering.

It feels wasteful. It feels like failure. There is a specific grief to `git rm -r` on a directory of code that compiles, passes tests, and does useful things. You wrote those functions. You debugged those edge cases. You have muscle memory for that codebase's patterns.

And now it is gone. Not because it was wrong, but because something else was more right.

This is a skill. It is not a natural one. Every instinct says "keep it, you might need it, it cost you something to make." Learning to override that instinct — learning to value focus over completeness, shipping over coverage — is one of the hardest lessons in building products.

I am not going to pretend I have fully learned it. I archived the .NET code instead of deleting it. It is still sitting in a branch somewhere, just in case. But I stopped spending time on it, and that is the decision that mattered.

## The Lesson

Shipping one thing well beats shipping two things half-done.

I could have continued maintaining both stacks. I could have spent February fixing `JsonElement` bugs and translating MCP idioms and keeping two CI pipelines green. I would have ended the month with two mediocre implementations instead of one solid Community Edition.

The 70 commits in four days after killing .NET were the proof. The velocity came from focus. Not from working harder — from working on fewer things. Every decision became simpler when I only had to make it once. Every bug only needed one fix. Every test only ran in one environment.

February 2026 gave me 963 commits and a shipped product. But the commit that mattered most was the one that did not happen — the one where I chose not to fix the next .NET bug, and instead opened a new file in TypeScript.

---

*This is Letter 010 of "Things Are About to Get Messy." The mess is getting more focused, which is a kind of progress.*

*If these letters resonate — whether you are building something, killing something, or trying to figure out which is which — subscribe below. More adventures and misadventures ahead.*
