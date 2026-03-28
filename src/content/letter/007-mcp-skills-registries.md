---
title: "MCP, Agent Skills Registries, and Finding the Starting Line"
description: "First real commits. work-iq-mcp at Microsoft, AgentSkillsRegistry exploration, and the website built around Claude-Flow that I'd soon pivot away from."
pubDate: 2026-01-28
tags: ["MCP", "skills-registry", "claude-flow", "first-commits", "pivots"]
pillar: "agents-coding"
draft: true
---

## The Month Everything Became Real

January 2026. The month of first real commits. After weeks of planning, diagramming, and psyching myself up, I finally opened a terminal and typed `git init`. Multiple times, actually — three repositories came to life between January 20th and 22nd. The planning phase was over. The building phase had begun.

And if you've ever come back to something after a very long time away — picked up a guitar after fifteen years, laced up running shoes after a decade on the couch — you know the feeling. Equal parts exhilaration and terror. The muscle memory is there, buried deep, but the landscape has changed so completely that the muscle memory almost makes it worse. You remember enough to know how much you don't know.

I hadn't written production code in a meaningful way since the days of OLE C++ and database replication. The tools were different. The patterns were different. The pace was different. But the fundamental act — translating an idea into instructions that a machine will execute — that was the same. And it felt extraordinary to be doing it again.

## work-iq-mcp: 37 Commits in 8 Days

My day job at Microsoft gave me the first real proving ground. work-iq-mcp was an internal project where I got hands-on with MCP — the Model Context Protocol — in a production-adjacent context. Thirty-seven commits in eight days. MCP Registry implementation. server.json configuration. README documentation. The kind of rapid, focused work that teaches you more about a technology than any tutorial ever could.

What I learned during those eight days shaped everything that came after.

I learned that MCP's tool registration model was elegant but opinionated — it assumed patterns of agent-tool interaction that matched some workflows perfectly and others awkwardly. I learned that server configuration was where most of the real-world complexity lived, not in the protocol itself but in the deployment and discovery layers around it. I learned that documentation mattered more in the MCP ecosystem than in most, because the developers integrating with your server were often AI agents themselves, parsing your tool descriptions to decide how to use them.

Most importantly, I learned that MCP was the right bet. The protocol was solid. The community was growing. The standard was evolving in a direction that aligned with governance use cases. Every hour I spent with work-iq-mcp reinforced my conviction that building a governance platform on MCP was architecturally sound.

## AgentSkillsRegistry: The Marketplace Question

In parallel, I spun up the AgentSkillsRegistry repository to explore a question that had been nagging me: what does a marketplace for agent skills look like?

If agents are going to use tools — and governance means controlling which tools they can use — then someone needs to curate, verify, and distribute those tools. An agent skills registry. A marketplace. But marketplaces have dynamics that are treacherous for a startup. Who owns the skills? Who verifies them? Who bears liability when a skill misbehaves? How do you prevent the marketplace from being captured by a dominant platform player?

I wrote enterprise strategy documents. I ran adversarial reviews against my own plans — trying to find the ways a larger competitor could undercut or absorb a skills marketplace. I drafted exit strategy analysis, not because I was planning to exit, but because thinking about how a marketplace ends teaches you about how it needs to begin.

The exploration was valuable even though the skills registry didn't become the core product. It taught me about provenance in a concrete way. When an agent invokes a skill, the governance layer needs to answer: where did this skill come from? Who published it? Has it been tampered with? Is it authorized for use in this security context? Those questions from the marketplace exploration fed directly into the governance engine I'd build later.

## Building Around Claude-Flow: The First Pivot

Here's the part where I tell you about a mistake I made in public, because that's what building in public means.

The first iteration of the AgentCraftworks website was built around Claude-Flow. Not just inspired by it — built AROUND it. The landing page described AgentCraftworks as an "Enterprise AI Orchestration Platform powered by Claude-Flow." There was an npm install command front and center: `npm install -g claude-flow@alpha`. The site linked directly to ruvnet's GitHub repository. The messaging positioned AgentCraftworks as, essentially, the enterprise wrapper around someone else's open-source project.

I was genuinely excited about Claude-Flow. The multi-agent orchestration patterns were sophisticated. The architecture aligned with problems I wanted to solve. And wrapping an open-source project with enterprise features is a proven business model — Red Hat did it, Elastic did it, Databricks did it.

But by January 29th — barely a week after the first commits — I was already pulling back. The npm package link came down first. By February 3rd, most of the Claude-Flow references were gone entirely, replaced by messaging about a GitHub App integration approach. The pivot happened fast because the problem became obvious fast.

## The Lesson: Own Your Identity

The issue wasn't Claude-Flow itself. The project was doing interesting work. The issue was dependency — not technical dependency, but identity dependency.

When your brand is "enterprise version of someone else's project," you've outsourced your identity. Your roadmap is constrained by theirs. Your messaging has to track their messaging. Your technical decisions are downstream of their technical decisions. And if they pivot, stall, or get acquired, your brand story collapses.

I'd spent enough years in enterprise to know this instinctively, but I'd let the excitement of launching override the instinct. The speed of those first weeks — the thrill of committing code, of having a website, of having SOMETHING — made me skip a step that matters. Your platform needs its own reason to exist, stated in your own terms, defended by your own architecture.

You can be inspired by other projects. You can learn from them, integrate with them, contribute to them. But "powered by [someone else]" is not a foundation. It's a dependency.

I'm glad I learned that lesson in week two rather than month six.

## The Git Log as Time Machine

I want to pause on something that might sound trivial but wasn't trivial to me at all.

Seeing commit hashes with my name on them. After decades.

```
commit a1b2c3d
Author: Jennifer Perret <jen@...>
Date:   Tue Jan 21 2026
```

There's a particular feeling when you've been away from the craft for a very long time and you come back. It's not just nostalgia. It's proof. Proof that you can still do this. Proof that the years of strategy and management and organizational leadership didn't erase the part of your brain that thinks in systems and logic and code.

Every commit in January was a small declaration: I'm back. I'm building. The output might be rough and the architecture might need three more pivots, but the commits are real and the timestamps are real and the diffs are real.

That matters more than I can properly articulate.

## What January Taught Me

Three repositories. Dozens of commits. One significant pivot already in the rearview mirror. And the month wasn't even over.

Here's what I took away from those first frantic weeks:

**Hands-on beats theory every time.** The eight days with work-iq-mcp taught me more about MCP than weeks of reading the spec. If you want to understand a technology, ship something with it.

**Explore adjacent spaces even if they're not your core product.** The AgentSkillsRegistry work didn't become the main thing, but it surfaced questions about provenance and trust that became central to the governance platform.

**Pivot early.** The Claude-Flow dependency was a mistake, but it was a cheap mistake because I caught it fast. The cost of a week-two pivot is negligible. The cost of a month-six pivot is brutal.

**Don't underestimate the emotional dimension.** Coming back to code after a long absence is a technical challenge, yes. But it's also an identity challenge. Letting yourself be a beginner again — in public, with stakes — requires a kind of courage that doesn't show up in architecture diagrams.

January was messy. Beautifully, productively messy.

Things were about to get messier.

---

*This is Letter 007 of a series about building AgentCraftworks in public. The journey from first commit to enterprise governance platform, told honestly. If you want to follow along as things get messier — and they will — subscribe.*
