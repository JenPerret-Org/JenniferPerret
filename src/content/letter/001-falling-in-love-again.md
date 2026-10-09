---
title: "Falling in love. Nothing better than being a builder again"
description: "After years managing product managers and missing the craft of building, I picked up code again. AI made it possible. But the journey back was messier than I expected."
pubDate: 2025-06-01
tags: ["origin-story", "career", "ai-assisted-coding", "growth-mindset"]
pillar: "ai-general"
draft: true
---

The last time I wrote code for a living, I was an individual contributor working in OLE C++, building database replication systems. That was the era of COM interfaces, reference counting, and debugging memory leaks at 2am with a debugger that crashed more reliably than the code it was debugging.

I loved it.

Then my career did what careers do. I moved into product management. I managed other product managers. My primary audience was developers, and I spoke their language, understood their pain, could read their code in reviews. But I rarely got to go deep anymore. The craft of *building* something yourself, of making a thing work, slowly faded into something I used to do.

For years I told myself I'd get back to it. I'd pick up a side project. Learn a modern framework. Build something.

I never did. Not because I didn't want to. Because every single time I tried, I bounced off the same wall — and the wall was more embarrassing than I wanted to admit.

Here's what nobody tells you about coming back to code after decades away: the hard part isn't the logic. The logic is still the logic. If-then-else hasn't changed. Data structures are data structures. The mental model for how software works is still there, buried under years of roadmap reviews and stakeholder alignment meetings.

The hard part is everything *around* the logic.

When did installing a dependency become a research project? Which package, which version, is it maintained, is it compatible with the other twelve things already installed, and why does this one need a peer dependency that conflicts with that one? You run `npm install` and pray. Something breaks. You google the error. Stack Overflow says delete `node_modules` and try again, which works until it doesn't, and then you're reading GitHub issues from 2019 trying to work out whether this is a known bug or whether you misconfigured something fundamental three steps back. Webpack, Vite, Turbopack, Rollup, Parcel — each with its own config file, its own mental model, its own dialect for telling you something is wrong. You just wanted to render a page. Wrong Node version. Wrong Python version. Wrong everything version. Three hours of a Saturday afternoon spent on someone else's tutorial project, never getting past step 2.

These aren't hard problems. They're *absurd* problems. The kind of friction a working developer barely registers because they wade through it daily, and the kind that is quietly fatal when you have limited time and you're trying to remember why you loved this in the first place.

I'd get stuck. I'd run out of weekend. I'd close the laptop and go back to the day job, where at least I could be effective.

I don't remember the exact moment it changed. It wasn't dramatic. I was fighting with a dependency install, again, and I asked an AI assistant for help. It didn't just answer the question. It understood the context — what I was trying to do, what was broken — and fixed it in a way that taught me something.

The wall stopped being a wall. It became a speed bump.

The absurd problems didn't disappear. They stopped being terminal. I could ask, get unstuck, keep moving. The ratio of building to fighting the toolchain shifted hard in favor of building, and that changed everything.

So I decided to build a website. Not just any website — one for the company I was forming around the idea that AI agents needed governance. AICraftworks.ai.

I hadn't built a site from scratch in, let's not count the years. The landscape had changed so completely I was effectively starting from zero. React? Next.js? Static site generators? Serverless? Edge functions? Every term led to five more terms, each with its own ecosystem and its own strongly held opinions.

But this time I had an AI pair programmer. And this time I didn't get stuck on step 2.

I got stuck on step 7. And step 12. And step 23.

But I *kept going*. That was the whole difference. Every time I hit friction I had a way through it — not around it, through it. I was still learning, still understanding what was happening underneath. Just not at the cost of an entire Saturday.

The first version was rough. The kind of rough where you're proud of it and embarrassed by it in equal measure. But it existed. It was deployed. It was mine.

A few things surprised me on the way there. The logic really hasn't changed: once you get past the tooling, building software is still building software, and if you could architect a database replication system in C++ you can architect a web application in TypeScript. The concepts transfer. The tooling, meanwhile, has changed completely — better, because what you can build now is extraordinary, and worse, because the cognitive overhead of merely *starting* is enormous. The ecosystem assumes you already know things that didn't exist five years ago.

And AI didn't replace my need to understand. It replaced my need to memorize. I still have to know what a build pipeline does. I don't have to remember webpack's exact config syntax. That distinction is the whole thing. AI made me a functional developer again not by doing the work, but by clearing away the friction that kept me from doing it myself.

The product manager in me remains both asset and liability. Asset because I can see the whole picture — user needs, market positioning, technical feasibility — in a way pure engineers sometimes don't. Liability because I keep wanting to write a PRD instead of writing the code. Old habits die hard, and mine have excellent survival instincts.

I'm writing this because I know I'm not the only one. There are a lot of us: people who used to code, who still think like engineers, who've spent years in adjacent roles watching the craft evolve from a distance. People who want to build but keep bouncing off the tooling.

AI changes that equation. Not by making coding easy — it's still hard, the problems are still real — but by removing the accidental complexity that made it inaccessible to anyone without unlimited time.

If you're sitting there thinking *I used to code, I wonder if I still can* — you can. It'll be messier than you expect. The first version will be embarrassing. You'll spend an unreasonable amount of time on things that feel like they should be simple.

But you'll be building again. And after all these years, that feeling is worth every frustrating dependency install.

What's the thing you keep telling yourself you'll get back to?

---

*This is Letter 001 of my series. I'm learning in public, sharing what works, what breaks, and what surprises me along the way. [Subscribe](#subscribe) to follow the journey.*
