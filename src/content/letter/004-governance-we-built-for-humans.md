---
title: "The Governance We Built for Humans"
description: "CODEOWNERS, signing, review gates, SBOM generation — all built assuming a human hits commit. What happens when that assumption breaks?"
pubDate: 2025-10-15
tags: ["governance", "software-supply-chain", "compliance", "NIST", "ISO-42001"]
pillar: "agents-coding"
draft: true
---

## An Inventory of What We Have

Before I talk about what breaks, I want to take a careful inventory of what exists. The software industry has spent decades building governance into the development lifecycle, and the result is a sophisticated, layered system that works remarkably well — as long as a human is at the center of it.

Let me walk through the stack.

**CODEOWNERS.** A file in your repository that maps paths to responsible humans. When a pull request touches `src/auth/`, it automatically requires review from the security team. When someone modifies the CI pipeline, the platform engineering lead has to approve. Simple, effective, and entirely built on the assumption that the entity creating the PR is a person with a name, a team, and an org chart position.

**Code signing.** Commits are signed with GPG or SSH keys tied to a verified identity. This creates a chain of trust: you can look at any commit in the history and know which human authored it. Enterprises require this. Auditors check for it. The entire model assumes that a cryptographic key maps to a person.

**PR review gates.** Before code merges, one or more humans review it. They check for correctness, security, style, architectural fit. Protected branches enforce minimum reviewer counts. Required status checks ensure tests pass. The review is a human judgment call — someone with context and authority saying "yes, this should ship."

**SBOM generation.** Software Bills of Materials catalog every dependency in your build. They exist so that when a vulnerability is disclosed in a transitive dependency four layers deep, you can figure out whether you are affected. SBOM standards like SPDX and CycloneDX trace provenance: where did this code come from, who published it, what license applies.

**Provenance attestation.** SLSA (Supply-chain Levels for Software Artifacts) provides a framework for ensuring that the artifacts you deploy are the artifacts you built, from the source you intended, through the pipeline you trust. Each level adds stronger guarantees. Each guarantee assumes human-controlled infrastructure and human-verified identities.

**Access controls and secrets management.** Repository permissions, environment secrets, deployment credentials — all scoped to human identities and human-managed service accounts with defined owners.

This is the governance stack we've built over twenty-plus years. It is good. It works. And every single layer assumes a human identity at the critical decision point.

## Walking Through the Lifecycle

Let me trace a typical secure development flow and mark every point where "human assumed" is load-bearing.

A developer (human) creates a branch. They write code (human judgment about design). They commit with a signed key (human identity). They push and open a PR (human requesting review). CODEOWNERS routes the review (to humans). Reviewers evaluate the change (human judgment). Status checks run in CI (configured by humans, triggered by human action). The PR is approved (human decision). The merge happens (human authorization). The build produces artifacts with provenance (tied to human-controlled pipeline). SBOM generation captures dependencies (introduced by human decisions). The deployment is authorized (human approval gate).

Count the assumptions. I get at least twelve points in that flow where the system fundamentally relies on a human being the actor, the decision-maker, or the identity anchor.

Now hold that number in your head.

## The Compliance Frameworks

I have been studying two compliance frameworks deeply: NIST SP 800-53 and ISO 42001.

**NIST SP 800-53** is the gold standard for federal information security controls. It covers access control, audit and accountability, identification and authentication, system and information integrity — hundreds of controls organized into families. It is thorough, well-structured, and built around the concept of "authorized users" performing "authorized actions." The word "user" appears constantly. The implicit model is a human sitting at a terminal, authenticated and authorized.

**ISO 42001** is newer and specifically addresses AI management systems. It acknowledges that AI introduces novel risks and requires organizations to manage them systematically. It covers data governance, transparency, bias, and accountability. It is a significant step forward. But even ISO 42001 largely frames AI as a tool that humans deploy and oversee — not as an autonomous actor in the software supply chain.

Both frameworks are essential. Both are incomplete for a world where AI agents are writing code, opening PRs, reviewing changes, and deploying software.

## The Questions I Cannot Answer Yet

This is the part of the letter where I resist the urge to jump to solutions. I have been thinking about these questions for weeks, and I do not have clean answers. What I have is a growing list of precisely articulated problems. Here they are.

**Identity.** When an AI agent commits code, whose identity is attached? The agent's operator? The platform that hosts the agent? The agent itself, as a non-human entity? Code signing assumes a key maps to a person. What does it mean to sign a commit with an agent's key, and who is responsible when that code introduces a vulnerability?

**Review.** Can an agent review another agent's code? If Agent A writes a function and Agent B reviews and approves it, does that satisfy a PR review gate? Should it? What if both agents are running on the same underlying model? Is that one reviewer or two? What does "independent review" mean when agents share weights?

**Provenance.** SBOM generation traces where code came from. But when an LLM generates code, where did it come from? The training data? The prompt? The model weights? The orchestration system that dispatched the task? Traditional provenance is a directed graph with clear edges. Agent-generated code has provenance that passes through a black box.

**Authorization.** CODEOWNERS routes review requests to the humans responsible for a code area. If an agent is generating code across multiple areas of a repository, every CODEOWNERS rule fires. Does the agent's operator need to be in every CODEOWNERS group? Or do we need a parallel authorization system for non-human actors?

**Audit.** Compliance auditors want to see who did what, when, and why. Agents can operate at speeds and volumes that overwhelm traditional audit logging. A human developer might make ten commits in a day. An agent swarm might make ten thousand. Are your audit systems designed for that volume? Is your compliance team prepared to review it?

**Revocation.** When a human employee leaves, you revoke their access. When you discover an agent is behaving unexpectedly, what is the revocation model? Kill the process? Rotate its keys? What about work it has already committed that has not yet been reviewed?

I do not have answers to these questions. Not yet. What I have is the conviction that they are the right questions, and that the industry needs to start asking them seriously before multi-agent systems become entrenched in production environments without governance.

## The Before Photo

Consider this letter a "before" photo. This is the state of software supply chain governance in late 2025: mature, sophisticated, effective, and built entirely around the assumption that humans are the primary actors in the development lifecycle.

That assumption is about to break. Not because the governance is bad — it is genuinely good — but because the world it governs is changing underneath it. AI agents are already writing code in production. They are opening PRs. They are being integrated into CI/CD pipelines. And they are doing all of this inside governance systems that do not know they exist.

The frameworks will need to evolve. The tooling will need to evolve. The mental models will need to evolve. And someone needs to do the careful, detailed work of figuring out exactly how.

That is what I am building toward with AgentCraftworks. But before I could build solutions, I needed to understand the current state with precision. Now I do. The next letters will start exploring what comes after.

---

*This is the fourth letter in a series about building enterprise AI governance. If software supply chain security and AI compliance are in your future, subscribe below to follow the thinking as it develops.*
