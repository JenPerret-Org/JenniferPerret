---
title: "What Happens When Agents Start Committing Code?"
description: "When an AI agent writes a PR, who signs it? When agents generate dependency trees, how do you attest provenance? The questions that crystallized the mission."
pubDate: 2025-11-15
tags: ["agents-coding", "provenance", "identity", "supply-chain", "questions"]
pillar: "ai-general"
draft: true
---

## The Shift Nobody Was Ready For

By late 2025, the ambient noise had become impossible to ignore. GitHub announced agentic features that would let AI propose, implement, and iterate on pull requests with minimal human involvement. Copilot Workspace matured from curiosity to daily driver. Cursor, Windsurf, and a half-dozen other agent-mode IDEs went from "interesting demo" to "my team ships with this." The phrase "vibe coding" entered the lexicon without irony.

I watched this unfold from two vantage points simultaneously. One was a seat inside Microsoft, where I'd spent decades building enterprise software and watching technology adoption curves play out across Fortune 500 companies. The other was a growing obsession with what happens when the entities writing your code aren't human — not in the philosophical sense, but in the deeply practical, "who is legally responsible for this artifact" sense.

The industry was celebrating productivity gains. I kept fixating on the gaps.

## The Questions That Wouldn't Let Me Sleep

It started with a single question that arrived uninvited one night and refused to leave: **When an AI agent writes a pull request, who signs it?**

Not metaphorically. Literally. Git commits have author fields. PRs have reviewers. Merge approvals have identity chains. The entire software supply chain is built on the assumption that a human being — traceable, accountable, with credentials tied to an identity provider — stands behind every change. What happens when that assumption breaks?

That question fractured into others, each more uncomfortable than the last.

**When a multi-agent system generates a dependency tree, how do you attest provenance?** If Agent A calls Agent B which invokes a tool that pulls a package that was itself partly authored by an agent — where does your SBOM (Software Bill of Materials) even begin? The concept of provenance assumes a chain of custody. Agents don't have custody. They have context windows.

**When your "developer" is a cascade of LLM calls, what does your compliance framework even mean?** SOC 2 controls assume human actors. ISO 27001 risk assessments assume human judgment. FedRAMP authorization boundaries assume human-operated systems. None of these frameworks were designed for a world where the entity making architectural decisions is a statistical model that can't explain its own reasoning in terms an auditor would accept.

**How do you audit something that didn't "think" the way a human thinks?** We audit human developers through code review, through design documents, through the rationale captured in commit messages and Jira tickets. An agent produces rationale too — but it's generated rationale, not recalled rationale. It's plausible text, not memory. The epistemological gap between "I chose this approach because..." from a human versus from an LLM is vast, and our audit frameworks have no vocabulary for it.

These weren't academic questions. They were the questions that would land on the desks of CISOs and Chief Compliance Officers at every regulated enterprise within eighteen months. Maybe twelve.

## Why the Existing Toolchain Falls Short

DevSecOps has come a long way. We have SAST, DAST, SCA, container scanning, signed commits, SLSA frameworks, Sigstore, in-toto attestations. The supply chain security community has done extraordinary work since the SolarWinds wake-up call.

But all of it — every single layer — was designed with a fundamental assumption baked in: that a human being initiated the action, understood the intent, and bears accountability for the outcome.

Agent-authored code doesn't break these tools exactly. It makes them necessary but insufficient. Your SAST scanner will still find the SQL injection. But it won't tell you that the injection was introduced by an agent that hallucinated a database query pattern from its training data, operating under a system prompt that nobody reviewed, in a chain of tool calls that nobody monitored in real time.

The gap isn't in detection. It's in governance. It's in the space between "we scanned the output" and "we governed the process that produced the output."

## The Decision to Build

I could have waited. The big platform companies would eventually bolt agent governance onto their existing offerings. GitHub would add agent attribution. Microsoft would extend Purview. AWS would build something with seventeen services and a three-letter acronym.

But I'd spent enough years inside those organizations to know the timeline. Enterprise platform features don't ship in months. They ship in years. They go through internal review, legal review, compliance review (the irony), partner alignment, GA readiness. By the time the major platforms shipped comprehensive agent governance, the regulated industries — healthcare, financial services, defense, critical infrastructure — would have been flying blind for two or three years.

Two or three years of AI agents committing code into production systems at banks. At hospitals. At defense contractors. Without governance frameworks. Without provenance attestation. Without audit trails that regulators would accept.

That timeline was unacceptable to me. Not as a business calculation — though the business opportunity was obvious — but as someone who spent a career building enterprise software and understood viscerally what "ungoverned" means at scale. I'd seen what happens when technology adoption outruns governance. The cleanup is always more expensive than the prevention.

## The Urgency Is Enterprise-Shaped

Here's what my Fortune 500 background told me that the startup ecosystem might miss: regulated enterprises don't get to "move fast and break things." They move at the speed their compliance frameworks allow. And right now, those frameworks have no answer for AI agents in the software development lifecycle.

This means one of two things happens. Either enterprises slow-walk agent adoption — losing competitive ground to less-regulated competitors and startups — or they adopt agents without governance and accumulate risk that will eventually detonate during an audit, a breach, or a regulatory examination.

Neither outcome is acceptable. There has to be a third path: govern the agents properly from the start.

That's the mission. Not to slow down agent adoption. Not to add bureaucratic friction. To make agent adoption safe enough that enterprises can actually embrace it at the speed the technology demands.

## The Moment of Commitment

I don't remember the exact date I decided to build this. I remember the feeling. It was the same feeling I had decades ago when I first saw OLE database replication and understood — not intellectually but in my bones — that distributed data was going to change everything and most people hadn't figured that out yet.

That feeling of seeing around a corner. Of knowing the questions before the industry has formulated them. Of understanding that the window between "too early" and "too late" is smaller than people think.

The questions I listed above aren't hypotheticals anymore. They're requirements. And requirements need solutions.

I was going to build one.

---

*This is Letter 005 of a series about building AgentCraftworks — an enterprise governance platform for AI agents — in public. If the intersection of AI, governance, and "things are about to get messy" resonates with you, subscribe to follow the journey.*
