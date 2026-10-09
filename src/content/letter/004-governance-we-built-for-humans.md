---
title: "The Governance We Built for Humans"
description: "CODEOWNERS, signing, review gates, SBOM generation: the tools still work when agents commit. What context do we need to add?"
pubDate: 2025-10-15
tags: ["governance", "software-supply-chain", "compliance", "NIST", "ISO-42001"]
pillar: "agents-coding"
draft: true
---

The failure is not that our governance is weak. The failure is that I kept seeing human identity as background plumbing, right up until agents made it load-bearing.

The software industry has spent decades building governance into the development lifecycle, and the result is a sophisticated, layered system that works remarkably well, as long as a human is at the center of it.

The stack looks like this.

**CODEOWNERS.** A file in your repository that maps paths to responsible users or teams. When a ready-for-review pull request touches `src/auth/`, it can automatically request the security team's review. Requiring that approval before merge is a separate branch protection or ruleset setting. The routing works whether the PR author is a human or a bot; the question is whether the designated reviewers have enough context to judge the agent's work.

**Code signing.** A verified commit signature provides evidence that the commit was signed with a particular key. It does not prove which human wrote the code, and the signer can be an automated system. That distinction matters: a trusted signature is not a certificate of sound judgment.

**PR review gates.** Before code merges, one or more humans review it. They check for correctness, security, style, architectural fit. Protected branches enforce minimum reviewer counts. Required status checks ensure tests pass. The review is a human judgment call, someone with context and authority saying "yes, this should ship."

**SBOM generation.** Software Bills of Materials inventory software components and their relationships, so that when a vulnerability is disclosed in a transitive dependency, you can investigate whether you are affected. Standards like SPDX and CycloneDX can capture component, supplier, and license information. The inventory is only as complete as the generation process; it is not, by itself, a record of how every line was authored.

**Provenance attestation.** SLSA (Supply-chain Levels for Software Artifacts) describes increasingly strong supply-chain guarantees. Build provenance records the builder, inputs, and process that produced an artifact. It is designed to work with automated builds, not just human authors. What it doesn't automatically capture is the agent's prompt, delegated authority, or tool-call history.

**Access controls and secrets management.** Repository permissions, environment secrets, deployment credentials, all scoped to human identities and human-managed service accounts with defined owners.

This is the governance stack we've built over twenty-plus years. It is good. It works with automation already. But in the workflows I knew, people supplied much of the context about intent and accountability. The org chart was doing more explanatory work than I gave it credit for.

Let me trace a typical secure development flow and mark every point where "human assumed" is load-bearing.

A developer (human) creates a branch. They write code (human judgment about design). They commit with a signed key (human identity). They push and open a PR (human requesting review). CODEOWNERS routes the review (to humans). Reviewers evaluate the change (human judgment). Status checks run in CI (configured by humans, triggered by human action). The PR is approved (human decision). The merge happens (human authorization). The build produces artifacts with provenance (tied to human-controlled pipeline). SBOM generation captures dependencies (introduced by human decisions). The deployment is authorized (human approval gate).

Count the assumptions in that human-led example. I get at least twelve places where I would ask who acted, who authorized it, and what evidence remains. That's my reading of the workflow, not a requirement imposed by a standard.

Now hold that number in your head.

I have been studying two compliance frameworks deeply: NIST SP 800-53 and ISO 42001.

**NIST SP 800-53** is a catalog of security and privacy controls for information systems and organizations. It covers access control, audit and accountability, identification and authentication, and system and information integrity. It includes controls for processes acting on behalf of users and for device identification; it is not limited to a human sitting at a terminal. My task is to work out how those controls apply to agent delegation and execution.

**ISO/IEC 42001** addresses AI management systems: the policies, procedures, and accountability an organization needs to manage AI-related risks and opportunities. It is an organizational management standard, not a ready-made implementation guide for agent-authored pull requests.

Both frameworks are useful. Neither relieves me of the work of translating requirements into controls for agents writing code, opening PRs, reviewing changes, and deploying software.

This is where I resist the urge to jump to solutions. I have been thinking about the questions that follow for weeks, and I don't have clean answers. What I have is a growing list of problems.

**Identity.** When an AI agent commits code, whose identity is attached? The agent's operator? The platform that hosts the agent? The agent itself, as a non-human entity? What does it mean to sign a commit with an agent's key, and who is responsible when that code introduces a vulnerability?

**Review.** Can an agent review another agent's code? If Agent A writes a function and Agent B reviews and approves it, does that satisfy a PR review gate? Should it? What if both agents are running on the same underlying model? Is that one reviewer or two? What does "independent review" mean when agents share weights?

**Provenance.** An SBOM inventories components; build provenance describes how an artifact was produced. Neither automatically explains why an LLM generated a particular implementation. What should we record about the prompt, model, and orchestration system that dispatched the task, without pretending we can reconstruct the model's internal reasoning?

**Authorization.** CODEOWNERS routes review requests using the matching owners for changed paths; the last matching pattern for each file takes precedence. It does not grant the PR author permission or require the author's operator to belong to those teams. How do we connect that review routing to a separate record of the agent's authority to act?

**Audit.** Compliance auditors want to see who did what, when, and why. Agents can operate at speeds and volumes that overwhelm traditional audit logging. A human developer might make ten commits in a day. An agent swarm might make ten thousand. Are your audit systems designed for that volume? Is your compliance team prepared to review it?

**Revocation.** When a human employee leaves, you revoke their access. When you discover an agent is behaving unexpectedly, what is the revocation model? Kill the process? Rotate its keys? What about work it has already committed that has not yet been reviewed?

I don't have answers to these questions. Not yet. I do have the conviction that they are the right questions, and that the industry needs to start asking them before multi-agent systems become entrenched in production environments without governance.

Consider this letter a "before" photo of my thinking in late 2025. The tools were mature, and automation was already part of the supply chain. I was still learning what additional evidence agents would require.

The world those tools govern is changing. AI agents are opening PRs and joining development workflows. Existing controls still matter; I want them to capture agent identity, delegated authority, and execution context rather than treating every automated change as an interchangeable bot action.

The frameworks will need to evolve. The tooling will need to evolve. The mental models will need to evolve. And someone needs to do the careful, detailed work of figuring out exactly how.

That is what I am building toward with AgentCraftworks. But before I could build solutions, I needed to understand the current state with precision.

I keep thinking about that number: twelve. Twelve places in one ordinary flow where we quietly assumed a human. What number is hiding in your own systems?

---

*This is Letter 004 in a series about building enterprise AI governance. If software supply chain security and AI compliance are in your future, subscribe below to follow the thinking as it develops.*
