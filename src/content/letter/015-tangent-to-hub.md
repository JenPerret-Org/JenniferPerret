---
title: "From Tangent to AgentCraftworks Hub: Building the Cockpit for Agent Governance"
description: "We forked a terminal app, rebranded it, and turned it into an Electron dashboard for agent governance. Meanwhile, dispatch emerged from nothing in 2 weeks."
pubDate: 2026-03-28
tags: ["hub", "electron", "dashboard", "dispatch", "tangent", "rebrand"]
pillar: "building-agents"
draft: true
---

If you're going to build a governance platform for AI agents, at some point you need a place where humans can actually see what the agents are doing. A terminal is fine for developers. A CLI is fine for automation.

But when a platform engineering lead wants to know why agent spend spiked 40% on Tuesday, they need a dashboard.

The failure was that I built enough moving parts to need a cockpit before I had finished admitting I was flying a plane.

This is the story of how we built ours.

AgentCraftworks Hub started life as a fork of Tangent, an open-source terminal application. On March 18 and 19, we bootstrapped the project in a series of rapid phases that turned a terminal app into an enterprise dashboard.

Phase 3 was the pivot point: we ripped out the terminal-centric UI and replaced it with an Electron dashboard shell, wiring up IPC channels so the renderer process could talk to the governance backend. If you have ever done IPC in Electron, you know this is the part where you either get the architecture right or spend the next six months fighting it. We got it mostly right. Mostly.

Phases 4 and 5 ran in parallel, an Ink-based terminal dashboard for developers who still wanted a CLI experience, plus an MCP server so the Hub itself could be governed by the same framework it was monitoring. Yes, governance all the way down.

Phase 6 brought alerts, a history store, and install scripts. The history store is worth a brief aside: we started with SQLite because that is what you do when you need local persistence in Electron. We switched to a JSON file within 48 hours. SQLite was overkill for our access patterns, added a native dependency that complicated builds across platforms, and introduced a class of concurrency bugs we didn't want to fight. Sometimes the boring solution is the right one.

Over 165 commits, "Tangent" became "AgentCraftworks Hub." This wasn't just a find-and-replace. Every icon, every window title, every IPC channel name, every config path, every reference in every README, all of it needed to change. The rebrand touched more files than some of our feature sprints.

The name matters because the product needed to stand on its own. Tangent was a fine terminal app. Hub is a governance cockpit. Different name, different identity, different promise to the user.

The feature list grew fast once the shell was in place. We replaced the terminal-based login interaction with an integrated GitHub OAuth flow. A later update displayed the device code inline; the user still had to complete GitHub sign-in and authorization when required. For enterprise users we added PAT-based authentication so teams with strict OAuth policies could still connect. When you're governing AI agents that make API calls, rate limits are a fact of life, so the Hub shows historical rate limit data as charts, not just "you hit a limit" but "here is the pattern of your usage over time, and here is where you are going to hit the wall again if you don't change something."

A billing poller and an audit log poller run as two background services that continuously pull billing data and audit events from GitHub, presenting them in near-real-time panels. The billing poller was particularly important: GitHub Actions usage can incur charges depending on repository visibility, runner type, and included allowances, and when you have agents running workflows, costs can spiral quickly if nobody is watching. A GHAW workflow health panel shows GitHub Actions workflow health with real-time metrics, success rates, failure rates, average duration, queue times, so when an agent kicks off a CI workflow, you can watch it from the Hub. Deep-link routing means clicking an alert takes you to the relevant panel with the relevant time range already selected, and clicking a governance event opens the audit detail, a small thing that makes the product feel like a product instead of a prototype. And token activity panels show which tokens are active, what they're doing, when they last authenticated, essential for enterprise security teams who need to know that agent credentials are being used as expected.

We also created a Figma design scaffold and a set of design tokens, colors, spacing, typography, so the Hub wouldn't look like a developer built it. Though a developer did build it. With agents.

While the Hub was taking shape as an Electron app, something else was happening in a completely different technology stack.

The dispatch TUI emerged from nothing on March 13. Written in Go using the Charm v2 stack, bubbletea for the application framework, bubbles for UI components, lipgloss for styling. In two weeks it accumulated 117 commits and became a legitimate terminal-based session manager.

Dispatch handles workspace session management, workspace recovery after crashes, self-updating, and WSL support for the Windows developers on the team. It is the thing you run when you sit down to work. It sets up your environment, connects to your governance context, and gets out of the way.

Why Go? Because the Charm ecosystem is the best terminal UI framework I've encountered, and because a pure-Go build can ship as a single binary without a separately installed Go runtime. For a tool that developers need to install and trust, that matters.

And then there was BizOps.

The BizOps repository, 214 commits, became an entire demo production studio. Remotion for programmatic video assembly. ElevenLabs for multi-voice AI narration. Playwright for automated browser capture. The pipeline could take a script, generate narrated video with screen recordings, and produce a polished demo without manual editing.

This wasn't planned. It grew out of the need to show people what we were building. When you're a solo founder with a sprawling platform, you can't schedule enough live demos. The videos needed to make themselves.

Step back and look at what was running in parallel during these weeks: the platform, TypeScript, the governance engine, the compliance frameworks, the rate governors and circuit breakers, this is the brain. The Hub, Electron, the dashboard, the monitoring and alerting, this is the cockpit. The website, Next.js deployed on Azure Static Web Apps, the public face, this is the front door.

Three product surfaces, three technology stacks, all being built simultaneously, all with agents helping, all needing the governance that was being built in the platform. The recursion is real: we were using AI agents to build the platform that governs AI agents, monitored by a dashboard built with AI agents, presented on a website built with AI agents.

It is sprawling. It is messy. Multiple surfaces are converging toward something coherent, and I can finally see the shape of it.

Building three product surfaces at once with a team of AI agents is either brilliant or reckless. Most days I'm not sure which. The Hub has rough edges. Dispatch has features that work perfectly and features that need another pass. The video pipeline produces great output 80% of the time and garbled nonsense the other 20%.

But all three exist. All three work. All three are getting better every day. And the breadth of what a single founder can build with agent assistance is something that wouldn't have been possible two years ago.

The cockpit is online. The instruments are lighting up. Now we fly.

---

*Want to watch the Hub evolve from fork to product? Subscribe and I'll bring you along for every rewrite, rebrand, and late-night Electron IPC debugging session.*