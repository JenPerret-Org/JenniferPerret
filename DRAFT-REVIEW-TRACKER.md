# Blog Draft Review Tracker

Track review and approval status for every blog draft. Change `[ ]` to `[x]` to mark a box as checked.

## Letters series

Sorted by publish date (`pubDate`), oldest first. Letter numbers are identifiers, not a second sort order. The 000/001 swap changes filenames and series labels, not their original dates.

Fact-check notes below cover every letter. "Reviewed" and "Approved" remain your decisions; an evidence pass is not approval to publish.

| # | Draft | Date | Reviewed | Approved | Notes |
| --- | --- | --- | :---: | :---: | --- |
| 001 | [Falling in love. Nothing better than being a builder again](src/content/letter/001-falling-in-love-again.md) | 2025-06-01 | [ ] | [ ] | [Author confirmation](#letter-001) |
| 002 | [From Microsoft Gold Stars to AI Startup: Why I Left the Mothership](src/content/letter/002-from-microsoft-gold-stars.md) | 2025-07-15 | [ ] | [ ] | [Career timeline needs confirmation](#letter-002) |
| 003 | [Discovering ClaudeFlow: My First Glimpse of Multi-Agent Orchestration](src/content/letter/003-discovering-claudeflow.md) | 2025-09-01 | [ ] | [ ] | [Rename corrected; memories pending](#letter-003) |
| 004 | [The Governance We Built for Humans](src/content/letter/004-governance-we-built-for-humans.md) | 2025-10-15 | [ ] | [ ] | [Technical claims corrected](#letter-004) |
| 005 | [What Happens When Agents Start Committing Code?](src/content/letter/005-agents-start-committing.md) | 2025-11-15 | [ ] | [ ] | [Product and standards claims corrected](#letter-005) |
| 006 | [Deciding to Build AgentCraftworks](src/content/letter/006-deciding-to-build.md) | 2025-12-15 | [ ] | [ ] | [MCP claims corrected; planning dates pending](#letter-006) |
| 007 | [MCP, Agent Skills Registries, and Finding the Starting Line](src/content/letter/007-mcp-skills-registries.md) | 2026-01-28 | [ ] | [ ] | [Illustrative commit removed; chronology pending](#letter-007) |
| 008 | [The Big Bang: 6 Sprints, 2 Stacks, 1 Weekend](src/content/letter/008-the-big-bang.md) | 2026-02-10 | [ ] | [ ] | [Weekend/date conflict unresolved](#letter-008) |
| 009 | [Stabilization Hell: When Moving Fast Breaks Everything](src/content/letter/009-stabilization-hell.md) | 2026-02-16 | [ ] | [ ] | [Core fixes supported by history](#letter-009) |
| 010 | [Killing the .NET Stack and Shipping the Community Edition](src/content/letter/010-killing-dotnet-shipping-ce.md) | 2026-02-24 | [ ] | [ ] | [Archive date corrected; totals pending](#letter-010) |
| 011 | [sub-pr-107-please-work: What Copilot Taught Me About Agent Governance](src/content/letter/011-sub-pr-please-work.md) | 2026-03-03 | [ ] | [ ] | [February incident confirmed; retry count pending](#letter-011) |
| 012 | [GitHub Agent Workflows: Config-Driven Governance at Scale](src/content/letter/012-github-agent-workflows.md) | 2026-03-10 | [ ] | [ ] | [Date precedes described integrations](#letter-012) |
| 013 | [Three Layers of Multi-Agent Orchestration (and One Painful Revert)](src/content/letter/013-three-layers-and-a-revert.md) | 2026-03-23 | [ ] | [ ] | [Monday incident confirmed](#letter-013) |
| 014 | [Six Enterprise Sprints in 48 Hours](src/content/letter/014-six-enterprise-sprints.md) | 2026-03-24 | [ ] | [ ] | [Date precedes March 27-28 work](#letter-014) |
| 000 | [Why I'm Starting This: Adventures in AI Agentic Development](src/content/letter/000-why-im-starting-this.md) | 2026-03-27 | [ ] | [ ] | [Series intro; date retained](#letter-000) |
| 015 | [From Tangent to AgentCraftworks Hub: Building the Cockpit for Agent Governance](src/content/letter/015-tangent-to-hub.md) | 2026-03-28 | [ ] | [ ] | [Hub history supported; other repos pending](#letter-015) |
| 016 | [JenniferPerret.com: Why I'm Writing This in Public](src/content/letter/016-why-im-writing-in-public.md) | 2026-04-04 | [ ] | [ ] | [Backfill count corrected; totals pending](#letter-016) |
| 017 | [Every Morning at 9am: The Day I Learned My Agents Were Fighting Each Other](src/content/letter/017-every-morning-at-9am.md) | 2026-04-18 | [ ] | [ ] | [API claims corrected; measurements pending](#letter-017). Merged rate-limit drafts |

## Progress

- Reviewed: 0 / 18
- Approved: 0 / 18

## Fact-check pass - October 8, 2026

All 18 drafts were read. Public technical claims were checked against primary documentation, and selected project events against repository metadata, commits, and PR records. A commit message establishes what was recorded, not that a feature worked in production, passed an audit, or met a benchmark. Current documentation is not proof of a feature's availability on an earlier letter date.

Personal experiences, emotions, career details, exact tallies, and claims without supporting logs remain **unverified**. No letter is fully fact-cleared yet. All retain `draft: true`. Check evidence links for access before publication; some project records require repository permissions. No private code or credential values are reproduced here.

### Letter 000

Intro moved from 001; original March 27 date retained. Recast the claim that existing controls cannot handle agents: automation is already supported; additional agent context is the concern. Confirm the described failed cascade detector and 3am compliance incident are actual experiences, rather than illustrative scenes inserted during drafting.

### Letter 001

Builder story moved from 000; June 1 date retained, and duplicate "first edition" footer removed. Confirm OLE/C++ database replication work, the return-to-coding timeline, company formation, the first deployment, and the specific late-night/toolchain anecdotes. These are memoir claims, not facts a technical documentation check can establish.

### Letter 002

Removed unsupported claims of being the only qualified builder and of governance being entirely absent. Confirm Microsoft start/departure dates, awards, High Potential Program participation, LLC formation, certification, and hackathon completion. The July 2025 departure framing conflicts with 007's January 2026 "day job at Microsoft"; resolve with the actual career timeline. Confirm permission to discuss employment-related work.

### Letter 003

[The upstream repository](https://github.com/ruvnet/ruflo) resolves the old `claude-flow` name to `ruvnet/ruflo`, not RuFlow. Separated the later rename from the personal pivot and made the September story explicitly retrospective. Confirm discovery date, which version was read/run, the January website positioning, and any claim that the rename triggered a change. Broad forecasts and uniqueness claims are opinions, not verified market research.

### Letter 004

Corrected CODEOWNERS review-request versus required-approval behavior, signature versus authorship, SBOM versus build provenance, and human-only framing of standards. Sources: [GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [SLSA provenance](https://slsa.dev/spec/v1.1/provenance), [NIST SP 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final), and [ISO/IEC 42001](https://www.iso.org/standard/42001). The twelve-point count is the author's interpretation of an example, not a standard. Confirm claims of personal study and enterprise practices; add a source or label the ten/thousand-commit contrast as illustrative.

### Letter 005

Removed the unsupported claim that Copilot Workspace became a late-2025 daily driver; used the coding-agent product instead. Recast blanket claims that SOC 2, ISO 27001, FedRAMP, and supply-chain tools assume only humans. Sources: the standards/provenance references above and [GitHub's coding-agent documentation](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent). Confirm employment chronology and personal incidents. Predictions about platform roadmaps, adoption windows, and audit acceptance are not established facts.

### Letter 006

Corrected TypeScript-only MCP, .NET-only Azure framing, and the claim that every agent action must pass through MCP. Sources: [June 2025 protocol specification](https://modelcontextprotocol.io/specification/2025-06-18) and [official SDKs](https://modelcontextprotocol.io/docs/sdk). Confirm December planning dates, certification date, January hackathon identity, and proposed eleven-level design. The later reductions have source support in 009, but that does not establish when the original plan was conceived.

### Letter 007

Removed the invented-looking `a1b2c3d` commit excerpt and its incorrect weekday (January 21, 2026 was Wednesday). Confirm repository ownership, January 20-22 creation dates, the 37 commits/eight days count, website removal dates, and strategy documents. The January 28 letter describes January 29 and February 3 work: either revise its date or consistently label it retrospective. Confirm authorization before publishing details about internal Microsoft work.

### Letter 008

Corrected MCP language claims and the unsubstantiated twenty-year tenure. **Unresolved:** February 9, 2026 was Monday, not Friday or a weekend start; the 48-hour/Sunday sequence and title need the actual build dates. Confirm six sprints, integration depth (stub versus working), weekend duration, and 963 commits with a defined repository/branch/timezone/merge-counting method. Do not use a commit total as evidence of production readiness.

### Letter 009

History supports numeric hashing fixes ([`f1d8ead`](https://github.com/AgentCraftworks/AgentCraftworks/commit/f1d8ead)), shell-command remediation ([`1182161`](https://github.com/AgentCraftworks/AgentCraftworks/commit/1182161)), and the eleven-to-five engagement and six-to-four state reductions ([`4294615`](https://github.com/AgentCraftworks/AgentCraftworks/commit/4294615), [`231a0f7`](https://github.com/AgentCraftworks/AgentCraftworks/commit/231a0f7)). Corrected the claim that a hash code throws an exception to announce a mismatch. Confirm EF Core conflicts, Stateless warnings, bug counts, and the claimed manual conflict-resolution/force-push actions. The "10x" debt discussion is an analogy, not a measured result.

### Letter 010

The archive commit is [February 15](https://github.com/AgentCraftworks/AgentCraftworks/commit/d08e71e), not February 20. CE repository metadata gives February 25 05:32 UTC, which is February 24 in Seattle; [the repository](https://github.com/AgentCraftworks/AgentCraftworks-CE) reports MIT licensing. Corrected MCP language and TypeScript compile-time checking claims; [TypeScript documents static checking](https://www.typescriptlang.org/docs/handbook/2/basic-types.html). Confirm 70 commits/four days, the 963 monthly total, the exact six tools and full CODEOWNERS syntax support at release, deployment readiness, pricing documents, and production-quality assertions. Archival is not deletion.

### Letter 011

The actual `sub-pr-107-please-work` branch appears in [February 13 UTC history](https://github.com/AgentCraftworks/AgentCraftworks/commit/4fc7edf), not first in March. Reframed the letter as a later account and removed a March 10 event from a March 3 narrative. Confirm the sixty-plus count, which attempts addressed which issue, whether each run was autonomous or user-triggered, and the success/failure classification. Branch names and repeated commits alone do not prove an autonomous code-scanning retry loop or an absence of all platform safeguards.

### Letter 012

Source history supports tiered-workflow integration ([`cce6114`](https://github.com/AgentCraftworks/AgentCraftworks/commit/cce6114)), accessibility routing ([`6750864`](https://github.com/AgentCraftworks/AgentCraftworks/commit/6750864)), and priority ordering ([`80589f9`](https://github.com/AgentCraftworks/AgentCraftworks/commit/80589f9)). **Date decision:** these are March 17-18 events, later than the March 10 letter date. Corrected the implication that a workflow alone enforces branch protection or blocks review. Confirm the exact config schema, trigger coverage, secret-age mechanism, test tiers, and demo results at the intended date. Distinguish this project's GHAW configuration from GitHub's own Agentic Workflows product.

### Letter 013

Confirmed [PR 657](https://github.com/AgentCraftworks/AgentCraftworks/pull/657), [PR 660](https://github.com/AgentCraftworks/AgentCraftworks/pull/660), [PR 661](https://github.com/AgentCraftworks/AgentCraftworks/pull/661), and [`c39d3b0`](https://github.com/AgentCraftworks/AgentCraftworks/commit/c39d3b0). Merges were March 23 at 01:05:51, 01:06:49, and 01:41:53 Seattle time: Monday, a roughly 36-minute cycle. Jennifer chose March 23 for both the letter and incident after seeing that evidence. Removed the unsupported integrated-test-failure cause; v2 records thirteen review corrections and both PRs report 62 passing tests. Confirm the actual revert trigger, three-layer boundaries, cryptographic identity guarantees, external-skill manifest/risk scoring, and the upstream identity/licensing of the named Microsoft toolkit. A commit title using "Microsoft" does not establish affiliation.

### Letter 014

March 27-28 history supports enterprise sprint implementations and the March 28 [Windows atomic-write fix](https://github.com/AgentCraftworks/AgentCraftworks/commit/0ff305e), [scope isolation](https://github.com/AgentCraftworks/AgentCraftworks/commit/2209bb1), and [MCP normalization fix](https://github.com/AgentCraftworks/AgentCraftworks/commit/89d5dfc). **Date decision:** March 24 precedes the events. Corrected the claim that any Windows read handle prevents rename and clarified that generated mappings do not certify compliance. Confirm the sixth-sprint time window, real versus mocked validation, Conditional Access enforcement mechanism, production deployment, and recurring bot statistics. Passing a local suite is not an auditor's acceptance.

### Letter 015

Hub history supports March 19 bootstrapping ([`23fefc4`](https://github.com/AgentCraftworks/AgentCraftworks-Hub/commit/23fefc4)), Electron/IPC, Ink/MCP, SQLite replacement ([`8f73aab`](https://github.com/AgentCraftworks/AgentCraftworks-Hub/commit/8f73aab)), auth changes, and workflow polling. Corrected "silent" authentication, unconditional paid Actions minutes, and Go runtime language. Confirm the Tangent upstream/license/attribution, 165/117/214 commit totals, dispatch repository and release dates, BizOps pipeline outputs, Next.js deployment, 40% spend example, and 80/20 video success claim. No source check establishes those percentages.

### Letter 016

Corrected the backfill count: 000-015 is sixteen letters. Recast claims that no governance frameworks exist. Confirm the May 2025 start, exact 3,000/ten-repository totals, ten-month duration, hackathon identity and April 3 judging extension, and weekly publication commitment. Avoid describing implemented control mappings as compliance certification. The claim of real-time writing needs the actual drafting dates.

### Letter 017

Corrected [REST authentication quotas](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api): user, built-in Actions token, App installation, and App user token are distinct. Corrected conditional-request guarantees using [GitHub's API best practices](https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api), GraphQL round-trip versus quota assumptions, default cron timezone, the runnable App-token example, and the Hub link. Removed unsupported "cheapest model" and agent-squad causation claims; the [April 10 changelog](https://github.blog/changelog/2026-04-10-enforcing-new-limits-and-retiring-opus-4-6-fast-from-copilot-pro/) addresses Copilot service/model limits, not REST quota.

Confirm actual tokens, failure headers, schedules/timezones, request measurements, the twenty-one-workflow count, cache/GraphQL adoption, snapshot freshness, governor thresholds, and checkpoint/resume behavior at the letter date. The three-hundred-request reserve and permissive fallback need implementation evidence and an explicit risk policy. The 9am/month-long incident remains a personal report, not a verified performance trace.
