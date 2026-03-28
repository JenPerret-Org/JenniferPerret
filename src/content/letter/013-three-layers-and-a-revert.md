---
title: "Three Layers of Multi-Agent Orchestration (and One Painful Revert)"
description: "The architecture crystallized into three layers. The Rate Governor shipped, got reverted, and shipped again — all in the same day."
pubDate: 2026-03-17
tags: ["architecture", "multi-agent", "rate-governor", "revert", "orchestration"]
pillar: "building-agents"
draft: true
---

## The Architecture Finally Has a Shape

There's a specific kind of relief that comes when a complex system you've been circling for months finally snaps into a shape you can draw on a whiteboard. For AgentCraftworks, that moment arrived in mid-March, and the shape was three layers.

Three layers of multi-agent orchestration. Each one solving a distinct problem. Each one documented in ADRs and SpecKits so that future-me (and future-team) can understand not just what we built but why we built it this way. Because architecture without rationale is just code that happens to be organized, and organized code without rationale becomes disorganized code the moment someone who wasn't in the room makes a change.

Let me walk through the layers.

## Layer One: Agent Identity and Provenance

The foundation. Before you can govern agents, you need to know who they are, where they came from, and what they're authorized to do. This layer handles identity attestation, provenance tracking, and capability declarations. Every agent operating within an AgentCraftworks-governed environment has a verifiable identity chain — not just a name, but a cryptographically attestable lineage that includes which model it's running, which tools it has access to, and which organization provisioned it.

This is the layer that answers the question I keep asking in every conversation with enterprise security teams: "When an agent opens a pull request in your production repo, can you tell me — with audit-grade certainty — what that agent is, who authorized it, and what permissions it was granted?"

If you can't answer that question, everything else is theater.

## Layer Two: Workflow Governance and Policy Enforcement

This is where GHAW lives — the config-driven policy layer I wrote about last week. Branch policies, routing rules, quality gates, approval chains. The operational machinery that ensures agents don't just have identities but operate within defined boundaries.

Layer Two is where most of the day-to-day governance happens. It's the layer that enforces rate limits, routes work to the right reviewers, and ensures that an agent's output meets quality thresholds before it reaches a human's attention. It's also the layer that integrates with external governance frameworks, which brings me to a significant addition this sprint.

## Microsoft AI Agent Governance Toolkit Integration

We integrated the Microsoft AI Agent Governance Toolkit into Layer Two. This is Microsoft's open framework for establishing governance standards for AI agents — covering everything from responsible AI principles to operational compliance requirements.

Bringing it in wasn't just a checkbox exercise. The toolkit provides a structured vocabulary for governance policies that maps well to the kinds of controls enterprises already understand. When a CISO asks "how does this comply with our responsible AI framework," having a direct integration with Microsoft's toolkit means we're speaking their language, not asking them to learn ours.

## Layer Three: Orchestration and Coordination

The top layer. When multiple agents need to work together — and in any real enterprise environment, they will — something has to coordinate them. Layer Three handles agent scheduling, conflict resolution, resource allocation, and the cascade detection that prevents one agent's failure from triggering a chain reaction across the system.

This is also where the external skills importer lives. Agents don't just run their own code — they consume capabilities from external sources. Third-party skills, community-contributed tools, upstream packages. The skills importer generates a provenance manifest for every external capability, documenting where it came from, what version it is, what its compatibility matrix looks like, and what risk score it carries.

Trust but verify. And document the verification.

## THE MISADVENTURE: Merged, Reverted, Re-Landed

Now let me tell you about March 23rd, because no architecture survives contact with reality unscathed, and what happened that day was a concentrated lesson in humility.

The Rate Governor MVP was ready. This is a core component of Layer Three — the system that prevents agents from overwhelming repositories with too many operations, too many PRs, too many changes in too short a time. Think of it as a circuit breaker for agent activity. It's literally the component that would have prevented the sub-pr-107-please-work disaster I wrote about two weeks ago.

The Rate Governor, along with the Squad Coordinator, shipped via PR #657. It was reviewed. It was approved. It was merged.

It was reverted the same day via PR #660.

It was re-landed as v2 via PR #661, also the same day.

Merged. Reverted. Re-landed. All within hours. On a Sunday.

## What Went Wrong

The first version had issues that only surfaced after merge. I'm going to be honest about this rather than vague, because the specific failure mode matters.

The Rate Governor's interaction with the existing test infrastructure produced failures that weren't caught in the PR's own test suite. The tests passed in isolation. They didn't pass in the integrated environment. This is a classic problem — one that any experienced developer has encountered — but it carries a special flavor of irony when the component that failed is the one designed to prevent rapid, insufficiently-tested changes.

The rate governor was supposed to prevent exactly the kind of rapid-fire merge-and-revert cycle that we ourselves performed in shipping it. If the Rate Governor had been governing its own deployment, it would have flagged: "You just merged a significant change. Maybe wait before merging the next one. Maybe run the full integration suite first."

Instead, we did what ungoverned developers do. We shipped fast, broke something, reverted fast, fixed it, and re-shipped. All on the same day.

## Eating Your Own Dog Food (and Choking a Little)

The phrase "eat your own dog food" exists because building tools for other people is easy compared to using them yourself. It's easy to design a rate-limiting system in theory. It's easy to write ADRs about why rapid merges are risky. It's easy to build governance controls that would catch exactly this problem.

It's much harder to actually submit to those controls when you're the one under deadline pressure, when the fix is right there, when you know it works this time, when the revert already cleaned up the mess and the v2 is ready to go.

Governance is a discipline, not just a technology. The technology enables the discipline, but the discipline has to be chosen, every time, by the humans in the loop. Including me. Especially me, since I'm the one building the governance platform.

March 23rd was a reminder of that.

## Agents Reviewing Governance Code

There's one more detail from this sprint that deserves mention, because it completes the recursive loop.

Commit c39d3b0 integrated Copilot review feedback into the governance codebase. Meaning: an AI agent was reviewing the code that governs AI agents. The agent had suggestions. Some of them were good. Some of them missed context that only a human who'd been living in the architecture for months would have.

This is the reality of building with agents: they're collaborators, not replacements. They catch things you miss. They miss things you catch. The governance framework has to account for both directions — governing what agents produce, and valuing what agents contribute.

## The Lesson

The three-layer architecture is sound. I'm confident in the decomposition, confident in the boundaries between layers, confident in the ADRs that document the rationale. The architecture survived its first real stress test, which is the March 23rd merge-revert-reland cycle.

But "survived" is doing some heavy lifting in that sentence. It survived the way a building survives an earthquake — still standing, but you can see exactly where the cracks formed, and you know where to reinforce.

The Rate Governor v2 is better than v1. Not just because of the bug fix, but because of what the failure taught us about our own testing assumptions. We now run the full integration suite before any governance component merge, not just the component's own tests. We have a checklist. We follow it.

Governance isn't something you build and deploy. It's something you practice. The messiness of March 23rd wasn't a failure of the architecture. It was the architecture teaching us how to use it properly.

I'll take that lesson. Even if it came with a revert.

---

*This is Letter 013 of a series about building AgentCraftworks in public. The architecture is crystallizing, the reverts are educational, and the irony is thick enough to cut with a knife. Subscribe if you want to watch the governance framework learn to govern itself.*
