# Markdown publishing workflow

## Source of truth

Markdown in `src/content/letter` is the canonical article source. Astro owns layout, navigation and generated discovery pages. Substack can distribute an edition by a separate, manual editorial decision; neither this build nor PolyPost sends newsletters.

The production site URL comes from `config/publishing.json` (`site`); staging builds (`DEPLOY_ENV=staging`) use `stagingSite`. Existing letter filenames and `/letter/<filename-without-extension>` URLs are preserved. Do not rename published files without an explicit redirect/migration plan.

## Authoring

1. **Agent or author:** Create an unpublished letter:

   ```powershell
   npm run post:new -- my-next-letter --title "My next letter" --pillar agents-coding --date 2026-11-20 --tags governance,agents
   ```

   The command refuses existing files, unsafe/reserved slugs and invalid metadata. It adds an unapproved tracker row. Use a flat kebab-case filename; `index`, `topics`, `tags` and `pillars` are reserved.

2. **Author:** Replace the placeholder summary and write the article. The supported front matter is:

   ```yaml
   ---
   title: "My next letter"
   description: "An accurate summary for the archive, RSS and social previews."
   pubDate: 2026-11-20
   tags: [governance, agents]
   pillar: agents-coding
   draft: true
   heroImage: /images/my-next-letter/cover.jpg
   heroImageAlt: "Describe what the cover conveys."
   social:
     text: "An optional introduction to the article, not the entire article."
     variants:
       linkedin: "An optional LinkedIn-specific introduction."
       bluesky: "An optional shorter introduction."
   ---
   ```

   The other pillars are `building-agents` and `ai-general`. A missing `draft` flag defaults to **true**, not published. Hero images are optional, but require alt text when supplied. Omit unused hero/social fields rather than leaving empty strings. Social variants support all seven PolyPost platform IDs listed in the social guide. They do not constitute social approval.

3. **Agent or author:** Run `npm run dev` and open its localhost address. Development includes drafts and future letters, visibly marked, with `noindex, nofollow`. RSS and public JSON still expose only publishable letters. Never tunnel or publicly host the editorial development server: `noindex` is not access control.

## Images and Markdown

Place images in `public/images/<letter-slug>/`, then reference them as root-relative URLs:

```markdown
![Describe the relevant information in this image.](/images/my-next-letter/diagram.png)
```

Use descriptive filenames, alt text and reasonably sized images. No automatic image optimization is configured; resize/compress before adding large originals. Root-relative links avoid differences between local and directory-style hosting. Use fenced code blocks with a language; standard headings, tables, links and lists are supported. Keep article headings at `##` or lower; the template supplies the one page-level `h1`.

**Everything in `public` is deployed, even images referenced only by drafts.** Never put confidential drafts, screenshots, customer materials, source documents, social backups or credentials there. Keep sensitive editorial assets outside the site repository until cleared for publication. Draft exclusion protects generated article text, not the repository history or files deliberately placed in public assets.

## Approval and publication

1. **Agent:** Help research, fact-check and preview the piece under `WRITING-POLICY.md`. Keep unresolved claims in the tracker. Passing checks is not editorial approval.
2. **Author:** Resolve outstanding claims, review the final text, and mark the exact letter row **Reviewed** and **Approved** in `DRAFT-REVIEW-TRACKER.md`. A copy-ready approval is:

   > I approve the final text of `<letter-slug>` for publication on jenp.ai. Set `draft: false` and prepare its publishing pull request. Social distribution requires a separate approval.

3. **Agent:** Only after that approval, set `draft: false`, verify the publication date and run the checks below. A date without a time means midnight UTC; use an ISO timestamp with an explicit offset when a particular release time matters.
4. **Author/maintainer:** Review and merge the pull request. The existing `main` deploy trigger builds and deploys. A date in the future stays out until a later build; use the deploy workflow's manual trigger when due. There is no background scheduling service.
5. **Author:** Verify the live article and social preview before distribution. Merging or deploying the site does not send emails or social posts.

Checks verify one tracker row with both boxes checked for every non-draft, including future-dated releases. They cannot establish who checked the boxes or whether a personal memory is true. Repository settings, authorized reviewers and the author's judgment enforce that boundary.

## Generated features and safety checks

| Output | Source and behavior |
| --- | --- |
| Homepage and `/letter` | Published letters, newest first; drafts/future letters appear only in local development |
| `/letter/topics`, `/letter/tags/<tag>`, `/letter/pillars/<pillar>` | Browsable tags and focus areas; production tags derive only from published content |
| `/rss.xml` | Valid XML with summaries and canonical article links, not full-text or newsletter delivery |
| `/sitemap.xml`, `/robots.txt` | Production indexable pages only; custom 404 is excluded |
| `/posts.json` | Public published-post metadata only, used to drive the search build |
| `/search` | Pagefind browser-side search over published article titles, descriptions and body text |
| Article metadata | Canonical URL, article date, Open Graph and Twitter image/title/description |

```powershell
npm run check
npm test
npm run build
npm run preview
```

`build` validates source and author approvals, builds Astro, indexes only published letters, then checks rendered output. It verifies exact-case local links/images, fragment targets, one `h1`, canonical/OG metadata, XML syntax, sitemap coverage, RSS membership, draft/future route exclusion, domain configuration and required search assets. It does not crawl external links, verify platform accounts or certify accessibility.

Search is generated after the build, so it is intentionally unavailable in `npm run dev`. Use the production preview. With no published letters, search displays an explicit empty state and no stale index is retained.

## CI, hosting and launch boundaries

Pull requests run the same checks for both production and staging builds without deploying or uploading a draft preview. Pushes to `staging` deploy to staging.jenp.ai (robots blocked, `X-Robots-Tag: noindex`); pushes to `main` deploy to www.jenp.ai. Both run Node 22 and must pass checks before upload. Staging applies the same draft/approval rules as production; it is a rehearsal, not a draft preview. See [Hosting and environments](hosting.md).

**Maintainer actions outside this checkout:** Require the `validate` job in branch protection/rulesets for `staging` and `main`, restrict who can change workflows and editorial approval records, and add required reviewers to the `production` GitHub environment. A production artifact and a protected deployment are different controls.

Before first launch, confirm HTTPS/DNS, the actual Substack destination and intended profile links. The existing Substack link remains unverified; no subscription or newsletter service was provisioned. No content was approved or published by this implementation.
