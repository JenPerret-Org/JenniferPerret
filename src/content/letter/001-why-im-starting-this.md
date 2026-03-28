---
title: "Why I'm Starting This — Adventures in AI Agentic Development"
description: "The software supply chain governance we built for humans doesn't just work for agents. This is my attempt to learn in public as I figure out what does."
pubDate: 2026-03-27
tags: ["intro", "governance", "software-supply-chain", "growth-mindset"]
pillar: "agents-coding"
draft: true
---

# Why I'm Starting This

Things are about to get messy.

For years, we built governance frameworks — compliance controls, security gates, supply chain integrity checks — with a clear assumption: **humans are writing the code**. We knew how to audit a developer's commit. We had signing, review gates, SBOM generation, and provenance attestation all figured out (mostly).

Then agents started coding.

And suddenly, the questions got interesting:

- When an AI agent writes a pull request, **who signs it**?
- When a multi-agent system generates a dependency tree, **how do you attest provenance**?
- When your "developer" is a cascade of LLM calls orchestrated by a coordinator agent, **what does your compliance framework even mean**?

## What This Weekly Letter Is About

I'm not here to pretend I have the answers. I'm here to **learn in public** — to share what I'm figuring out, what's working, and (maybe more usefully) what's going sideways.

Three areas I'll be exploring:

### 1. Agents Writing Code
This is my primary focus. The security and compliance requirements we built for our software supply chain assumed human developers. Now we need to make them work with agents. I think there will be a lot of different approaches and things to learn rapidly.

### 2. Building Agentic Solutions
The architectures, patterns, and hard lessons from building multi-agent orchestration systems. Rate governors, circuit breakers, cascade detection — the plumbing that keeps agent systems from going off the rails.

### 3. AI — The Bigger Picture
The broader landscape. Where is this going? What should we be paying attention to? What are we all getting wrong?

## Why "Adventures and Misadventures"?

Because a growth mindset means being honest about the misadventures. The times the cascade detector didn't catch the cascade. The compliance control that looked great on paper but fell apart when agents started generating code at 3am. The architectural decision that seemed clever until it wasn't.

Those are the stories worth sharing.

**Things are about to get messy. Let's figure it out together.**

---

*This is the first edition of my weekly letter. Subscribe to get future editions delivered to your inbox.*
