---
title: "Stabilization Hell: When Moving Fast Breaks Everything"
description: "Dozens of JsonElement hash violations. Shell injection vulnerabilities. Branch names ending in '-please-work'. The week after the big bang was pure chaos."
pubDate: 2026-02-16
tags: ["stabilization", "bugs", "design-pivot", "copilot-struggles", "technical-debt"]
pillar: "building-agents"
draft: true
---

You know that feeling the morning after a party when you turn on the lights and see what the living room actually looks like? That was February 10 through 15 for AgentCraftworks. The weekend hackathon was over. The adrenaline was gone. And now I had to make all of this code actually work.

It did not go well.

## The Bug Parade

The .NET stack greeted me Monday morning with dozens of `JsonElement` hash and equality contract violations. If you have not had the pleasure of debugging these, the short version is: floating-point precision differences mean that two `JsonElement` values that look identical are not, in fact, equal. The serializer says 1.0, the deserializer says 1.0, and the hash code says "these are different objects and I will throw an exception to prove it."

This was not one bug. This was the same conceptual bug manifesting in dozens of places across the governance data models, because when you scaffold an entire platform in a weekend, you scaffold the same mistakes at scale.

Then came the EF Core version conflicts. Then the Stateless library deprecation warnings. Then the TypeScript side started complaining — build errors from unused imports, type mismatches in the handoff service, package-lock reverts that kept undoing each other.

And then we found the shell injection vulnerability.

## The Security Wake-Up Call

One of the governance tools accepted a repository path parameter and passed it to a shell command. Unsanitized. In a platform whose entire purpose was to make AI agents safer. The irony was not subtle.

We caught it. We fixed it. But it was a stark reminder that velocity without discipline produces exactly the kind of risk I was building AgentCraftworks to prevent. I was the cobbler whose children had no shoes, except the shoes were input validation and the children were shell commands.

## The Branch Naming Saga

If you ever want to see what it looks like when an AI coding assistant is struggling, look at the branch names. During this week, I watched Copilot generate a cascade of sub-PR branches that told the whole story:

`sub-pr-24`

`sub-pr-24-yet-again`

`sub-pr-24-please-work`

Copilot was creating branches, opening PRs, hitting merge conflicts with its own previous PRs, creating new branches to fix the conflicts, and then conflicting with those. It was a recursive nightmare of good intentions. I eventually had to step in, manually resolve the conflicts, and force-push to break the cycle.

This is one of the less-discussed realities of AI-assisted development: when things go wrong, they can go wrong in loops. A human developer hits a merge conflict and stops to think. An AI assistant hits a merge conflict and tries to fix it, which creates a new commit, which creates a new conflict, which it tries to fix. The failure mode is not "stuck" — it is "spinning."

## The Big Pivot

By mid-week, the bugs were forcing architectural questions I had been avoiding.

The original design had an 11-level autonomy dial. Eleven levels of agent autonomy, from "fully supervised" to "fully autonomous," each with distinct governance rules, escalation paths, and audit requirements. On paper, it was comprehensive. In practice, it was incomprehensible. No one could remember what level 7 meant versus level 8. The governance rules for adjacent levels overlapped in ways that created contradictions.

We collapsed it to a 5-level engagement model. Five levels. Clear names. Distinct behaviors. It was a better design by every measure, and it only emerged because the 11-level version kept producing edge-case bugs that were impossible to reason about.

The same pressure hit the handoff state machine. The original design had 6 states for managing agent-to-human handoffs: pending, active, paused, escalated, completed, failed. Under testing, "paused" and "escalated" kept creating ambiguous transitions. An escalated handoff that got paused — was it still escalated? A paused handoff that failed — did it transition through active first?

We collapsed to 4 states: pending, active, completed, failed. Clean. Unambiguous. Every transition well-defined.

These were not minor tweaks. These were fundamental architecture decisions — the kind that normally happen in design review before any code is written. We were making them in week two because the code was already written and it was telling us the design was wrong.

## The Commit That Says It All

There is one commit message from this week that I keep coming back to:

`fix: stabilize main -- resolve TS/dotnet build errors and CI test failure`

That single commit contained changes across both stacks, fixing build errors, updating test assertions, correcting type definitions, and getting CI green again. It was a stabilization commit — the kind you write when everything is broken and you just need the main branch to compile.

In a well-run project, you should never need a commit like that. In a project where one person scaffolded two full stacks in a weekend with AI assistance, you need a dozen of them.

## The Debt Equation

Here is what I learned during stabilization hell: AI-assisted velocity has a debt multiplier.

When you write code manually, you create technical debt at human speed. You cut a corner, you know you cut it, and you have a rough mental model of the cleanup cost. When AI helps you generate code at 10x speed, you create technical debt at 10x speed, and your mental model of the cleanup cost is 10x too optimistic because you did not write every line yourself.

The code looked professional. It had proper error handling, reasonable type definitions, sensible file organization. But it also had subtle inconsistencies — slightly different patterns for the same problem in different files, naming conventions that drifted across modules, test coverage that was thorough in some areas and absent in others. The kind of issues that emerge when code is generated by a system that does not have a persistent memory of every decision it has made.

This is not an argument against AI-assisted development. It is an argument for understanding the trade-off. You can move faster. The debt accumulates faster too. Stabilization is not optional — it is the price of velocity, and you pay it whether you budget for it or not.

## The Irony

I will say it plainly because it deserves to be said plainly: I was building a governance platform for AI agents while my own AI-assisted codebase was ungoverned.

The tools I was building — the action classifier, the permission checker, the autonomy dial — existed precisely to prevent the kind of chaos I was living through. The shell injection vulnerability. The cascading merge conflicts from Copilot. The architectural decisions made under pressure instead of with deliberation.

AgentCraftworks was, in a very real sense, being built to solve the problems that building AgentCraftworks had created. If that is not motivation to ship, I do not know what is.

---

*This is Letter 009 of "Things Are About to Get Messy." The mess in question is now well-documented in the git log.*

*Next time: the hardest decision of the month — killing half of what we just built. Subscribe to follow along.*
