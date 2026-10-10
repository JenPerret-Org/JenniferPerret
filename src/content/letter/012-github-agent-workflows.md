---
title: "GitHub Agent Workflows: Config-Driven Governance at Scale"
description: "GHAW takes shape: config-driven workflow control, branch policy guards, secret rotation, and label-based agent routing. Governance becomes a product."
pubDate: 2026-03-10
tags: ["GHAW", "github", "config-driven", "governance", "workflows", "hackathon"]
pillar: "building-agents"
draft: true
---

There's a phase in every product where it transitions from "concept I can describe" to "thing that exists and does something." For GitHub Agent Workflows, GHAW, that moment arrived in mid-March, under hackathon deadline pressure, which meant it arrived messy, fast, and exhilarating.

The failure was that the demo worked best if you treated it like a museum exhibit: follow the arrows, don't touch the glass.

GHAW is the answer to a question I've been circling for months: how do you give organizations control over how AI agents operate in their repositories without requiring them to become experts in agent architecture? The answer was simple in concept and complex in execution.

One config file. Schema-driven. Documented. Enforceable.

The core insight behind GHAW is that governance shouldn't require a PhD in AI safety. It should look like something developers already understand: a configuration file in the root of your repository.

`ghaw-config.json` is that file. It's a single JSON document that defines how agents are allowed to operate in your repo. Which branches they can touch. What approval workflows apply to their PRs. How they're routed based on the type of work. What quality gates they must pass before their changes are considered for merge.

The schema is strict and documented. You can validate it. You can version it. You can review changes to it in a pull request, just like any other infrastructure-as-code artifact. Your governance policy becomes a first-class citizen of your repository, subject to the same review processes as the code it governs.

This is the shift I keep coming back to: governance as code, not governance as process. Not a wiki page somewhere that describes what agents should do. A machine-readable file that enforces what agents can do.

The first workflow we built on top of the config was Branch Policy Guard, a policy check intended to catch non-compliant branch and PR workflows. It still depends on repository settings: a failing check blocks a merge only when it is required, and bypass permissions need their own controls.

The problem it solves is straightforward: in an enterprise environment, branch protection rules are a critical security control. But when multiple agents create branches and open PRs, the surface area for misconfiguration expands. An agent might create a branch that bypasses required reviews. A workflow might merge something that shouldn't have been merged.

Branch Policy Guard reads the GHAW config and checks declared policies in GitHub Actions. The workflow's configured triggers determine when it runs. Used as a required check with appropriate branch protections, it can block non-compliant changes from merging. One less thing for the team to manually verify. One more thing that's automated and auditable.

Security hygiene is one of those things that everyone agrees matters and nobody wants to manage manually. The Secret Rotation Reminder is a simple but high-value workflow: it tracks the age of repository secrets and credentials, and proactively alerts when rotation is due.

It's not flashy. It's not the kind of feature that wins hackathon applause. But it's exactly the operational discipline enterprises need and agents make easier to maintain. The workflow is configured through GHAW, which means the rotation schedule is part of your governance-as-code policy, not a calendar reminder in someone's inbox that gets ignored when they go on vacation.

This is where things got interesting.

Not all agents are equal, and not all work is equal. A security-focused agent reviewing a dependency update should take priority over a documentation agent cleaning up README files. A critical accessibility fix should be routed differently than a routine code style suggestion.

GHAW implements label-based agent routing with explicit priority ordering: security agents take precedence over accessibility agents, which take precedence over documentation agents, which take precedence over default catch-all routing. Each tier maps to different review requirements, different approval chains, and different merge policies.

The routing integrates with CODEOWNERS, so the right humans are still in the loop for the right changes. Agents don't replace human oversight, they operate within a structured system that ensures human attention goes where it matters most.

We also integrated the tiered agentic workflows from githubnext/agentics. Tier 1 agents handle straightforward, well-scoped tasks with minimal supervision. Tier 2 agents tackle more complex work that requires richer context and heavier review. The tier classification maps directly to the GHAW config, so organizations can define their own risk appetite for different types of agent-initiated changes.

One decision I'm particularly proud of: accessibility agents are first-class citizens in GHAW, not an afterthought.

We integrated the Community-Access/accessibility-agents framework directly into the routing system. Accessibility fixes get their own priority tier, their own review workflow, and their own quality gates. This isn't just good ethics, though it is that; it's good engineering. Accessibility issues are often caught late in the development cycle because they require specialized knowledge that not every team has in-house. Agents that can catch and fix these issues early, operating within a governed framework that ensures quality, are genuinely transformative for teams that struggle with accessibility compliance.

The conditions were not noble and serene: hackathon deadline pressure.

There's a particular flavor of productivity that only emerges when you have a demo date that won't move and a product that isn't yet ready. The Playwright testing scaffold went in with a five-tier test structure that I'm still proud of, even though I wrote most of it at a pace that would make a test engineer wince. The demo workflow ran end to end, but only if you didn't deviate from the exact sequence I'd rehearsed.

That's fine. That's what hackathon demos are. The structure was sound. The architecture was right. The rough edges were the kind that polish out with time, not the kind that indicate a flawed foundation.

This sprint crystallized something I've been struggling to articulate for months.

The old framing of governance is guardrails. Rails on the side of the road to keep you from driving off a cliff. Necessary but negative. Nobody wakes up excited about guardrails.

GHAW reframes governance as a product. It's not preventing bad things, though it does that. It's enabling good workflows. It's the infrastructure that makes it possible for a team to adopt AI agents confidently, knowing that security reviews happen automatically, that accessibility is checked proactively, that branch policies are enforced consistently, and that the whole system is configured through a single, version-controlled, human-readable file.

That's not a guardrail. That's a platform. And platforms are something people choose to adopt, not something they grudgingly comply with.

Because nothing happens in isolation when you're a solo founder, all of this was happening alongside a full website overhaul. Hero animations went in. Feature tiles were polished. The FAQ section was written and rewritten. Pricing badges got "Coming Soon" labels because the pricing model was still being refined and I refuse to put numbers on a page until I'm confident in them.

The website work felt like a different part of my brain entirely, visual, marketing-oriented, audience-facing, compared to the systems thinking of GHAW. Switching between them was disorienting but useful. Every time I came back to the config schema after writing marketing copy, I saw it with fresh eyes. Every time I went back to the website after debugging a workflow, I had a clearer sense of what mattered to say.

GHAW is a product now. It has a config schema, working workflows, a testing scaffold, and a demo that runs end to end. It's early and it's rough, but it exists, and it works, and the architecture is right.

The next step is taking this from "hackathon demo" to "something an enterprise team can actually adopt." That means hardening the schema, writing real documentation, building an onboarding flow, and, most importantly, eating our own dog food by running GHAW on the AgentCraftworks repos themselves.

If governance as code is real, it should govern its own development. That's the test.

---

*This is Letter 012 of a series about building AgentCraftworks in public. The product is taking shape. If you want to watch governance become a product instead of a burden, subscribe to follow the journey.*