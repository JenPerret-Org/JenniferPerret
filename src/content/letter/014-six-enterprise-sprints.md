---
title: "Six Enterprise Sprints in 48 Hours"
description: "Entra ID, Conditional Access, Sentinel, Bicep, NIST/ISO compliance-as-code, and nuSquad SDK, all shipped in two days. Plus the Windows EPERM bug that almost derailed everything."
pubDate: 2026-03-24
tags: ["enterprise", "compliance", "NIST", "ISO-42001", "Entra-ID", "Sentinel", "sprint"]
pillar: "agents-coding"
draft: true
---

There's a particular kind of exhaustion that comes from shipping six enterprise sprints in roughly 48 hours. It's not the tired of a long meeting or a late night debugging session.

It's the tired of having held an entire compliance architecture in your head for two straight days while agents generated code faster than you could review it, and the only thing standing between you and production was your own judgment about what "good enough" actually means.

And then Windows reminded me that "works everywhere" is not a promise you get to make until EPERM has had its say.

March 27 and 28 were those days.

It started with Entra ID. Sprint 1 laid the authentication foundation, wiring up Microsoft's identity platform so that AI agents operating inside an enterprise could actually prove who they were. Not a toy demo. Real token validation, real tenant isolation, real MSAL integration. This was table stakes, but table stakes done wrong would poison every sprint that followed.

Sprint 2 built on that foundation with Conditional Access, the policy layer that determines whether a given agent, in a given context, should be allowed to do a given thing. We implemented trust seeding so new agents could bootstrap their way into a governance hierarchy, and we shipped a set of MCP identity tools so the whole thing was callable through the Model Context Protocol. The plumbing nobody sees and everybody depends on.

Sprint 3 was the Sentinel connector and event pipeline. Every governance decision, every policy evaluation, every circuit breaker trip, all of it needed to flow into Microsoft Sentinel for security teams to monitor. I committed this sprint twice on different branches because I was working in parallel on the platform and the compliance layer. Version control saved me, but only barely.

Sprint 4 gave Sprint 3 somewhere to live: a Bicep infrastructure module for deploying Sentinel workspaces, data collection rules, and log analytics configuration as code. Infrastructure-as-code for the infrastructure that monitors the agents that write code. The recursion isn't lost on me.

Sprint 5 was the one I'm most proud of and most uncertain about. NIST SP 800-53 and ISO/IEC 42001 control mappings, evidence collection, and gap analysis expressed in code. That is tooling to support compliance work, not certification that the system or organization complies.

Sprint 6 rounded it out with nuSquad SDK integration, laying the foundation for multi-agent squad orchestration to plug into the governance framework we had just built.

Shipping six sprints means nothing if they don't work together. We built an enterprise validation suite that exercised all six sprints end-to-end: authenticate an agent via Entra ID, evaluate a Conditional Access policy, emit governance events to Sentinel, validate the Bicep deployment template, check compliance against NIST and ISO controls, and orchestrate a squad interaction through nuSquad.

We also built scope-isolated circuit breakers with TTL-based pruning, so that when one agent in a squad hits a rate limit, it doesn't cascade into a platform-wide outage. The cascade detector watches for failure patterns across scopes, and the circuit breaker responds proportionally. This wasn't theoretical. We had real test cases where a misbehaving agent could take down governance for an entire tenant.

The Squad Engagement Dial emerged as a three-layer governance model: individual agent limits, squad-level coordination, and platform-wide circuit breaking. Think of it as a volume knob for how aggressively agents can operate, tunable per tenant, per squad, per agent.

And then there was the CISO CustomerExperience Validation-Demo Suite, because if you can't show a Chief Information Security Officer how your governance works in under ten minutes, you don't have a product. You have a research project.

Late on the 28th, with all six sprints passing validation, I hit a wall. The rate-state-store was failing with EPERM errors. But only on Windows.

The bug was in our atomic write implementation. The rename-over-temp-file pattern could fail on Windows when a conflicting open handle prevented replacement. Whether a file can be renamed depends on the sharing flags used when it was opened; a reader does not always block a rename. The error was intermittent, dependent on timing, and maddening.

The fix was to harden the atomic write path with retry logic and fallback strategies specific to Windows file locking. Not glamorous. Not interesting at a conference talk. Absolutely essential for anyone actually running this on a Windows development machine, which, if you're building enterprise software, you probably are.

The EPERM bug wasn't alone. Once the big validation suite started running, it shook out a cascade of smaller issues.

MCP prefix normalization was broken, we had been doing a naive string split to map MCP tool names to governance actions, and it fell apart on tools with multiple namespace segments. The fix was a proper `normalizeToolToAction` function that understood the naming hierarchy.

Scope key sharing had bugs where two different scopes could accidentally share a circuit breaker state. Duplicate mapping meant a single governance action could trigger two compliance checks. Each was a fifteen-minute fix that would have been a production incident.

Agents helped me ship six enterprise sprints in two days. That's extraordinary. The volume of code generated, reviewed, tested, and committed was something I couldn't have done alone in two weeks, let alone two days.

But compliance requirements still needed accountable human judgment. Agents could help explain controls and propose mappings. That did not make a generated AC-2 mapping an audit finding, a Conditional Access implementation proof of compliance, or a Sentinel event schema a guarantee that it would fit a SOC team's playbooks.

The agents were spectacular at generating the code. I was necessary for knowing what the code needed to do and why. This division of labor, agents for velocity, humans for judgment, is the core thesis of everything I am building. These two days proved it more viscerally than any whiteboard session could.

One small amusing detail: we have an automated code-simplifier bot that runs daily across the codebase. It keeps simplifying the same seven files over and over. telemetry.ts, policy-engine.ts, audit-service.ts, and a handful of others. Every day it finds something to tighten. Every day it opens a PR. I have started to think of it as the world's most persistent junior developer, always right, never done.

Six sprints. Forty-eight hours. An enterprise governance framework that authenticates agents, enforces conditional access policies, streams events to a SIEM, deploys infrastructure as code, validates against two major compliance frameworks, and orchestrates multi-agent squads.

Is it done? No. Is it shipping? Yes. Is it messy? Absolutely.

Things are about to get messier.

---

*If you want to follow along as this enterprise governance platform takes shape, the wins, the EPERM bugs, and everything in between, subscribe to get these letters in your inbox.*
