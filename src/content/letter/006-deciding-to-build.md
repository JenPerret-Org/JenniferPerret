---
title: "Deciding to Build AgentCraftworks"
description: "Why a governance platform? Why TypeScript AND .NET? Why MCP? The architectural bets I made before writing a line of code — and the ones that turned out wrong."
pubDate: 2025-12-15
tags: ["agentcraftworks", "architecture", "planning", "MCP", "dual-stack"]
pillar: "building-agents"
draft: true
---

## Before a Single Line of Code

December 2025. I had the questions from my previous letter burning a hole in my brain, and I had the conviction that someone needed to build answers. What I didn't have was a codebase, a team, or — honestly — a clear picture of what the product actually was.

So I did what any self-respecting ex-enterprise architect would do. I planned. I diagrammed. I wrote strategy documents to an audience of one. I filled notebooks with boxes and arrows and crossed most of them out.

Looking back, some of those early decisions were sharp. Others were... optimistic. I'm going to tell you about both, because the whole point of building in public is that you don't get to retroactively edit your judgment.

## Why Governance, Not Another Agent Framework

The agent framework space in late 2025 was already crowded and getting more crowded by the week. LangChain, CrewAI, AutoGen, Semantic Kernel, and a dozen others were competing to be the thing you build agents WITH. New frameworks were launching monthly. The tooling for making agents was exploding.

But I kept asking: who governs them once they're running?

The gap wasn't in agent creation. It was in agent accountability. Nobody was building the layer that sits between "we deployed agents" and "we can prove to our auditors, our regulators, and our board that those agents operated within defined boundaries."

Every enterprise I'd worked with at Microsoft had governance requirements. Access control. Audit trails. Compliance attestation. Change management. These aren't nice-to-haves in regulated industries — they're table stakes. And none of the agent frameworks were addressing them as a first-class concern. Governance was always "you can add that later" or "plug in your existing SIEM."

I didn't want to build framework number thirty-seven. I wanted to build the thing that makes frameworks one through thirty-six safe to deploy in a Fortune 500.

## The Dual-Stack Bet

This is where I need to be honest about a decision that seemed brilliant in December and looked questionable by January.

I planned a dual-stack architecture: TypeScript for the web-facing layer, the MCP integration surface, and the developer tooling. .NET Aspire for the enterprise backend — the heavy lifting of compliance engines, audit storage, and integration with corporate identity providers.

The logic was sound on paper. TypeScript owned the AI/ML ecosystem. npm was where MCP libraries lived. The developer community building agents spoke JavaScript and TypeScript. But enterprise backends at banks and insurance companies? They ran on .NET and Java. Azure services were .NET-native. If I wanted to sell to the Fortune 500, I needed to speak their language.

Two stacks. Two ecosystems. One platform. What could go wrong?

I'll foreshadow the answer: within weeks of actually writing code, the .NET side would be shelved. Not because .NET was wrong for the problem, but because I was one person, building at startup speed, and maintaining two technology stacks with two build systems, two dependency chains, and two mental models was a tax I couldn't afford. The TypeScript ecosystem was moving faster, MCP was TypeScript-native, and every hour I spent on .NET interop was an hour I wasn't shipping governance features.

But in December, I didn't know that yet. In December, the dual-stack felt like strategic genius.

## Why MCP as the Integration Layer

One bet I don't regret: choosing the Model Context Protocol as the primary integration surface.

MCP was still early. Anthropic had published the spec, a few reference implementations existed, and the community was small but passionate. It wasn't the obvious choice. Most people building agent tooling were using custom APIs, proprietary protocols, or framework-specific abstractions.

But MCP had something the others didn't: it was an open standard designed specifically for the problem of connecting AI models to external tools and data. It wasn't trying to be an agent framework. It was trying to be the protocol that agent frameworks speak. That's a different thing entirely, and it's the right layer for a governance platform to hook into.

If I built on MCP, I could govern agents regardless of which framework created them. I wouldn't be tied to LangChain or CrewAI or whatever the hot framework was next quarter. I'd be at the protocol layer — the place where all agent actions eventually flow through on their way to the real world.

That bet held up. It's still holding up as I write this.

## Concepts on Paper

Before touching a keyboard, I sketched out core concepts that I thought a governance platform needed. Some of these survived to the actual product. Some didn't.

**Handoff state machines.** When Agent A delegates to Agent B, that's a governance event. The state transition needs to be captured, authorized, and auditable. I designed state machines for tracking agent-to-agent handoffs with full provenance chains. This concept survived and became central to the architecture.

**Autonomy dials.** How much freedom does an agent get? I originally designed an eleven-level autonomy scale, from "fully supervised" to "fully autonomous." Eleven levels. I was very proud of those eleven levels. They were carefully differentiated and precisely defined and absolutely nobody would ever configure them correctly. The concept survived but the scale got dramatically simplified. Sometimes less granularity is more governance.

**Action classifiers.** Every action an agent takes — reading a file, calling an API, modifying data, spending money — has a risk profile. I designed a classification system that would tag every action with risk metadata and route it through appropriate approval workflows. This concept survived and became the backbone of the compliance engine.

## Preparation as Momentum

While the architecture was still on paper, I made a deliberate investment: I went and got my Azure AI Fundamentals certification (AI-900). Not because the certification itself would teach me anything I couldn't learn from docs, but because the structured preparation forced me to systematically cover ground I might have skipped. Responsible AI principles. Azure AI service boundaries. The vocabulary that enterprise buyers use when they evaluate AI platforms.

It was also a confidence signal — to myself as much as anyone. I'd been away from hands-on technical work for a long time. The OLE C++ database replication days were decades behind me. Earning a current certification in the AI space was a small but meaningful proof point that I could re-enter the technical arena and hold my own.

## The Hackathon on the Horizon

One more factor shaped the December planning: I'd spotted the Agentic AI Hackathon coming up in January. A deadline. A forcing function. The thing that separates "I'm going to build something" from "I built something."

I didn't know yet exactly what I'd submit. But I knew that having a hard deadline would compress the planning phase and force me to start shipping. Decades of enterprise experience taught me that the most dangerous phase of any project is the space between "we have a great plan" and "we've written our first line of code." That gap can stretch forever if you let it.

I wasn't going to let it.

## The Tension

The honest truth about December 2025 is that I lived in tension between two impulses. One said: plan more, diagram more, research more, get it right before you start. The other said: just open an editor and type something. Ship something. Learn from the thing you shipped rather than the thing you imagined.

Both impulses are right. Both are wrong. The skill is in knowing when to stop planning and start building, and I don't think there's a formula for that. There's just a moment when the planning starts feeling like procrastination, and you have to be honest enough with yourself to recognize it.

I recognized it somewhere around December 28th.

It was time to write code.

---

*This is Letter 006 of a series about building AgentCraftworks in public. Next time: first commits, first pivots, and the thrill of seeing your name on a git log after twenty-some years away from the keyboard. Subscribe if you want to follow along.*
