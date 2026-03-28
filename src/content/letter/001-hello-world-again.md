---
title: "Hello World (Again): Building AICraftworks.ai After Decades Away From Code"
description: "After years managing product managers and missing the craft of building, I picked up code again. AI made it possible — but the journey back was messier than I expected."
pubDate: 2025-06-01
tags: ["origin-story", "career", "ai-assisted-coding", "growth-mindset"]
pillar: "ai-general"
draft: true
---

# Hello World (Again)

The last time I wrote code for a living, I was an individual contributor working in OLE C++, building database replication systems. That was the era of COM interfaces, reference counting, and debugging memory leaks at 2am with a debugger that crashed more often than the code you were debugging.

I loved it.

Then my career did what careers do. I moved into product management. I managed other product managers. My primary audience was developers — I spoke their language, I understood their pain, I could read their code in reviews — but I rarely got to go deep anymore. The craft of *building* something yourself, of making a thing work, slowly faded into something I used to do.

For years, I told myself I'd get back to it. I'd pick up a side project. I'd learn a modern framework. I'd build something.

I never did. Not because I didn't want to, but because every time I tried, I'd hit the same wall.

## The Wall

Here's what nobody tells you about coming back to code after decades away: the hard part isn't the logic. The logic is still the logic. If-then-else hasn't changed. Data structures are data structures. The mental model for how software works is still there, buried under years of roadmap reviews and stakeholder alignment meetings.

The hard part is everything *around* the logic.

**Libraries.** When did installing a dependency become a research project? Which package? Which version? Is it maintained? Is it compatible with the other twelve things I already installed? Why does this one need a peer dependency that conflicts with that one?

**Dependency installs.** `npm install` and pray. Something breaks. Google the error. Stack Overflow says to delete `node_modules` and try again. That works until it doesn't. Now you're reading GitHub issues from 2019 trying to figure out if this is a known bug or if you misconfigured something fundamental.

**Toolchains.** Webpack? Vite? Turbopack? Rollup? Parcel? Each one has its own config file, its own mental model, its own way of telling you something is wrong. You just wanted to render a page.

**Environment setup.** Wrong Node version. Wrong Python version. Wrong everything version. You spend three hours on a Saturday afternoon trying to build someone else's tutorial project and never get past step 2.

These aren't hard problems. They're *absurd* problems. They're the kind of friction that doesn't stop a working developer who deals with them daily, but they're devastating when you have limited time and you're trying to remember why you loved this in the first place.

I'd get stuck. I'd run out of weekend. I'd close the laptop and go back to my day job, where at least I could be effective.

## Then AI Changed the Equation

I don't remember the exact moment it clicked. It wasn't dramatic. I was probably fighting with a dependency install — again — and I asked an AI assistant for help. And it didn't just answer my question. It *understood the context*. It knew what I was trying to do, it knew what was broken, and it fixed it in a way that taught me something.

Suddenly, the wall wasn't a wall anymore. It was a speed bump.

The absurd problems — the library conflicts, the config files, the environment issues — didn't disappear. But they stopped being blockers. I could ask, get unstuck, and keep moving. The ratio of *building* to *fighting the toolchain* shifted dramatically in favor of building.

And that changed everything.

## Building AICraftworks.ai

So I decided to build a website. Not just any website — a website for the company I was forming around the idea that AI agents needed governance. **AICraftworks.ai.**

I hadn't built a website from scratch in... let's not count the years. The landscape had changed so completely that I was essentially starting from zero. React? Next.js? Static site generators? Serverless? Edge functions? Every term led to five more terms, each with their own ecosystem and opinions.

But this time, I had an AI pair programmer. And this time, I didn't get stuck on step 2.

I got stuck on step 7. And step 12. And step 23.

But I *kept going*. That was the difference. Every time I hit friction, I had a way through it. Not a way *around* it — I was still learning, still understanding what was happening — but a way through that didn't cost me an entire Saturday.

The first version of the site was rough. Really rough. The kind of rough where you're proud of it and embarrassed by it in equal measure. But it existed. It was deployed. It was *mine*.

## What I Learned (and What Surprised Me)

**The logic hasn't changed.** Seriously. Once you get past the tooling, building software is still building software. The abstractions are different, the syntax is different, but the thinking is the same. If you could architect a database replication system in C++, you can architect a web application in TypeScript. The concepts transfer.

**The tooling has changed completely.** And honestly? It's both better and worse. Better because the things you can build are extraordinary. Worse because the cognitive overhead of just *starting* is enormous. The ecosystem expects you to already know things that didn't exist five years ago.

**AI doesn't replace the need to understand.** It replaces the need to *memorize*. I still need to understand what a build pipeline does. I don't need to remember the exact webpack config syntax. That's a crucial distinction. AI made me a functional developer again, not by doing the work for me, but by eliminating the friction that kept me from doing the work myself.

**The product manager in me is both a blessing and a curse.** A blessing because I can see the whole picture — user needs, market positioning, technical feasibility — in a way that pure engineers sometimes don't. A curse because I keep wanting to write a PRD instead of writing the code. Old habits die hard.

## Why This Matters

I'm writing this because I know I'm not the only one. There are a lot of us out here — people who used to code, who still think like engineers, who've spent years in adjacent roles watching the craft evolve from a distance. People who want to build but keep bouncing off the tooling.

AI changes the equation. Not by making coding easy — it's still hard, the problems are still real — but by removing the *accidental complexity* that made it inaccessible to people with limited time.

If you're sitting there thinking "I used to code, I wonder if I still can" — you can. It's messier than you expect. The first version will be embarrassing. You'll spend an unreasonable amount of time on things that feel like they should be simple.

But you'll be *building* again. And that feeling? After all these years?

It's worth every frustrating dependency install.

---

*This is the first edition of my weekly letter. I'm learning in public — sharing what works, what breaks, and what surprises me along the way. [Subscribe](#subscribe) to follow the journey.*
