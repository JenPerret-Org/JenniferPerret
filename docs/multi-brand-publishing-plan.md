# Multi-brand publishing operating plan

**Status:** Proposed expansion; only the Jennifer Perret site and its local PolyPost adapter are implemented.

## One publishing capability, three editorial identities

Share the machinery, not the voice, approval or signed-in account. Keep one canonical home for each article and distribute audience-specific introductions rather than duplicate feeds.

| Brand | Editorial purpose | Content and evidence | Primary next step |
| --- | --- | --- | --- |
| Jennifer Perret / www.jenperret.com | Personal perspective and learning in public | First-person letters, experiments, failures and reflections under the existing writing policy | Read, follow, discuss; newsletter only after its destination is confirmed |
| AICraftworks business | Explain business problems and available services | AI-native operating models, readiness, consulting approaches and approved case evidence | A discovery conversation or an offer whose availability is confirmed |
| AgentCraftworks product | Make the product understandable and verifiable | Actual capabilities, tutorials, release notes, implementation evidence and clearly labeled roadmap | Documentation, a demo or evaluation only when actually available |

The existing [LinkedIn GTM proposal](linkedin-gtm-proposal.md) is the positioning baseline. Business and product domains, repositories, account/page URLs, permissions and shipped offers are not established by this plan.

## What exists now

1. **Agent-delivered:** A Markdown/metadata schema, draft-first scaffolding, tracker approval checks, private local previews, static publishing, topic browsing, feeds, metadata, search and CI.
2. **Agent-delivered:** `config/publishing.json` names all three identities, but activates only Jennifer Perret. The social adapter refuses the two planned brands rather than generating links to guessed domains or reusing the personal site.
3. **Agent-delivered:** Native PolyPost kits with platform variants, brand-qualified names, source hashes and manual account/approval/receipt fields. No external accounts, schedulers, cross-post APIs, analytics or newsletter integrations have been configured.

## Target architecture

```text
Brand-owned Markdown + assets + editorial policy
                 |
       source validation and review
                 |
       brand-specific static build
                 |
       approved deployment / canonical article
                 |
       approved excerpt and platform variants
                 |
       PolyPost named draft in the correct browser profile
                 |
       destination-specific human approval
                 |
       manual publication + receipt + learning
```

Start with separate site/content repositories and deployments for the business and product. Reuse this proven starter, then extract a small shared tooling package when the second real site exposes the common pieces. Do not build a multi-tenant CMS, fork PolyPost or introduce a monorepo migration before the ownership and deployment requirements are known.

Each site must select exactly one brand. Its content, search index, RSS, sitemap and deployment artifact must never aggregate other brands implicitly. A future shared editorial dashboard may display several brands, but must filter by brand and must not grant publishing access merely because a user can view the dashboard.

## Phased delivery and decision gates

### Phase 1: Finish and rehearse the personal site

1. **Agent:** Preserve all existing drafts, prepare a reviewed publishing PR, and rehearse the due/approved-post and PolyPost import paths using synthetic fixtures.
2. **You:** Confirm public links, newsletter destination, desired first article, Azure Static Web Apps environments and domain/DNS ownership. Approve content separately from infrastructure.
3. **Maintainer:** Enable required checks and appropriate deployment approvals. Rehearse a staging release before production DNS changes.
4. **You:** Approve one personal-site article and a small set of channel variants, manually publish, and retain receipts.

**Exit:** A real approved article is accessible at its canonical URL, previews correctly, appears in RSS/search, and has verified destination receipts. The implementation alone does not satisfy this live-launch gate.

### Phase 2: Activate AICraftworks business publishing

1. **You:** Choose its canonical domain and repository, editorial owner, approved company positioning, available offers, permitted evidence and actual company-page/account destinations.
2. **Agent:** Create a separate Astro site from the established workflow; apply business branding, business-specific content pillars and an independent review tracker. Parameterize the tooling for that site's explicitly chosen brand only.
3. **Agent:** Add negative isolation checks: personal/product drafts cannot enter the business build, links use the chosen business domain, and brand/account mismatches block distribution preparation.
4. **You:** Approve the first business article and its company-specific social framing. Confirm company-page roles in the native platform before posting.

**Exit:** Independent deployment/approval, no guessed offers or accounts, and one completed business publication with receipts.

### Phase 3: Activate AgentCraftworks product publishing

1. **You/product owner:** Choose its domain/repository and accountable reviewer; distinguish shipped, experimental and planned capabilities and approve evidence that can be public.
2. **Agent:** Implement product-specific templates for tutorials, releases and roadmap, with version/availability/evidence metadata where applicable. Keep this separate from memoir letters and consulting offers.
3. **Agent:** Add checks for required release/version/evidence fields in the relevant content types; distinguish planned features visibly rather than describing them as shipped.
4. **You/product owner:** Approve product claims and each destination variant; publish only against verified product state.

**Exit:** A product publication backed by a reproducible demo, release or source evidence, with separate deployment and distribution approvals.

### Phase 4: Add a shared editorial control plane only when useful

1. **You:** Choose an approved private system of record, access model, retention policy and owners. Decide whether local kits remain sufficient before commissioning a service.
2. **Agent:** Aggregate metadata into a brand-scoped calendar/queue, not a shared public content folder. Track decisions, final variants, content hashes and receipts durably.
3. **Agent:** Add duplicate detection per `(brand, article, platform, account, approved-content-hash)`, retries with explicit outcomes and an audit trail. A retry must not publish a second post or treat a failed copy as success.
4. **You:** Separately approve any platform API integrations, credentials, LLM processing, scheduling, analytics or automatic posting. PolyPost's present browser-local interface must not be presented as a headless API.

**Exit:** Measurable reduction in editorial work without weakening brand isolation or approval. Automation is optional; human-controlled PolyPost distribution remains supported.

## Shared records to introduce in Phase 4

| Record | Minimum fields |
| --- | --- |
| Brand | Stable ID, canonical origin, content repository, policy, editorial owner, deployment target |
| Article | Brand ID, stable content ID/slug, revision/hash, canonical URL, publication time, evidence references, review decision |
| Distribution | Article revision, platform, exact destination account/page/instance, final copy/media, reviewer and timestamp, approval state |
| Delivery | Distribution ID, attempted action, outcome, native post URL/ID, timestamp, error and duplicate/retry key |
| Learning | Campaign/source tags, reporting window, available referral/conversation signals and observations |

Use explicit states: `draft -> in-review -> approved -> deployed` for articles; `prepared -> in-review -> approved -> manually-published -> verified` for distribution. A copied post is not delivered; a user-entered receipt is not verified until the destination is checked. Editing approved text invalidates that revision's approval. Never transfer an approval between brands or destinations.

Track meaningful outcomes: useful discussions, qualified discovery and product learning. UTM links create attribution labels, not guaranteed traffic or AI-search visibility. Decide analytics/privacy requirements before collecting audience data.

## First pilot

Use one theme with three genuinely different treatments:

| Owner | Treatment | Boundary |
| --- | --- | --- |
| Jennifer | A personal lesson about discovering an agent-ownership gap | Confirm it actually happened; no invented first-person incident |
| AICraftworks | A practical operating-model question organizations can assess | Describe a framework/hypothesis, not an unverified customer outcome |
| AgentCraftworks | A tutorial or demo showing how the current product addresses a bounded part | Only claim capabilities supported by the actual released or clearly experimental implementation |

Do not write or publish all three merely to fill a calendar. Start with one or two quality pieces per week across the operating effort, measure the workload, and expand only after the first brand's cycle is reliable.

## Copy-ready scope approvals

1. **Personal launch:** "Prepare a staging deployment of www.jenperret.com. Keep every unapproved letter private. Do not change production DNS or publish social posts."
2. **Business activation:** "Plan the AICraftworks site using domain `<domain>` and repository `<repository>`. `<owner>` owns editorial approval. Do not deploy or connect accounts until I approve that plan."
3. **Product activation:** "Plan the AgentCraftworks product blog using `<domain>` and `<repository>`. Use only the approved capability/evidence list. Keep roadmap clearly labeled and do not publish."
4. **Social pilot:** "Prepare PolyPost variants for `<approved article>` under `<brand>`. Do not send content to AI providers or post to any account. I will approve each destination separately."

Domain choices, account access, content approval and new infrastructure are later decisions. This plan does not authorize or perform them.
