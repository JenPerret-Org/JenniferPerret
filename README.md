# jenp.ai

Jennifer Perret's Markdown-driven Astro site. Letters live in `src/content/letter`; GitHub Actions builds static HTML and deploys it to Azure Static Web Apps: `staging` → [staging.jenp.ai](https://staging.jenp.ai) (not indexed) and `main` → [www.jenp.ai](https://www.jenp.ai). No database or CMS is required. See [Hosting and environments](docs/hosting.md).

## Write and preview

Use Node.js 22.12 or later.

```powershell
npm ci
npm run post:new -- my-next-letter --title "My next letter" --pillar agents-coding --tags governance,agents
npm run dev
```

The new post starts as `draft: true` and is added to `DRAFT-REVIEW-TRACKER.md` as unreviewed and unapproved. Local development shows drafts and future posts with a preview banner and `noindex`; do not expose that server publicly.

```powershell
npm run check
npm test
npm run build
npm run preview
```

Production builds exclude drafts and future letters from **pages, listings, RSS, sitemap, public JSON, and search**. A non-draft must also have both author-review boxes checked in the review tracker. All 18 existing letters remain drafts.

Only the author approves publication. After approval, set `draft: false` in a reviewed pull request to `staging`, check staging.jenp.ai, then promote `staging` to `main` for production. Validation does not deploy. A future publication date requires another build after that date; there is no scheduler.

## Distribute with PolyPost

```powershell
npm run social:prepare -- my-next-letter --brand jennifer-perret
```

This creates a **local, gitignored** kit under `.social`: a native PolyPost version-1 backup, per-platform Markdown copy, and a review/receipt checklist. It refuses drafts, future letters, and posts without author approval. It makes no network requests and never posts.

Open [Mark Russinovich's PolyPost](https://aka.ms/Polypost), use **Import backup**, then restore the named draft. Review each platform's formatting, length, account and link before manually posting. Website approval is not social approval. Verify the article is actually live first.

## Guides

- [Writing, images, approvals, and deployment](docs/publishing-workflow.md)
- [PolyPost social distribution and receipts](docs/social-media-tooling.md)
- [Multi-brand publishing plan](docs/multi-brand-publishing-plan.md)
- [Existing LinkedIn GTM proposal](docs/linkedin-gtm-proposal.md)
- [Writing policy and voice](WRITING-POLICY.md)
- [Draft review tracker](DRAFT-REVIEW-TRACKER.md)

`config/publishing.json` identifies the active personal brand and reserves separate, inactive AICraftworks and AgentCraftworks identities. Their domains, accounts, and deployments are deliberately not invented or enabled.
