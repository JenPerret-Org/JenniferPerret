---
title: "Why I'm Starting This: Adventures in AI Agentic Development"
description: "The software supply chain governance we built for humans doesn't just work for agents. This is my attempt to learn in public as I figure out what does."
pubDate: 2026-03-27
tags: ["intro", "governance", "software-supply-chain", "growth-mindset"]
pillar: "agents-coding"
draft: true
---

Things are about to get messy.

For years I thought about governance frameworks, compliance controls, security gates, and supply chain integrity checks through the lens of human developers. The tools already handled automation. But people supplied much of the context about intent and accountability. We had signing, review gates, SBOM generation, provenance attestation. I thought I understood where the responsibility sat.

Then agents started coding, and every one of those questions got interesting again.

When an AI agent writes a pull request, who signs it? When a multi-agent system generates a dependency tree, how do you attest provenance? When your "developer" is a cascade of LLM calls orchestrated by a coordinator agent, what does your compliance framework even mean?

I don't have the answers. I have a governance background, a half-built platform, and a growing pile of evidence that the controls I helped design need more context when agents are involved. So I am going to write it down as I go.

Three things I'll be working through here. First, agents writing code: the security and compliance requirements we built for the software supply chain, and what has to change now that the developer isn't a person. This is the one I care most about and the one nobody is answering well. Second, the engineering of it — rate governors, circuit breakers, cascade detection, the unglamorous plumbing that keeps agent systems from going off the rails. Third, the wider view: where this is heading, what we should be paying attention to, and what we are collectively getting wrong.

The subtitle says "adventures and misadventures," and the second word does most of the work. The cascade detector that didn't catch the cascade. The compliance control that looked immaculate in the design doc and fell apart the first time agents started generating code at 3am. The architectural decision that seemed clever right up until it wasn't. Those are the stories worth telling, partly because they teach more, and partly because I have a healthy supply.

A growth mindset isn't optimism. It's a willingness to be publicly wrong on a schedule.

Things are about to get messy. What are you watching break?

---

*This is the first edition of my weekly letter. Subscribe to get future editions delivered to your inbox.*
