# Social distribution with Mark Russinovich's PolyPost

## What is integrated

The local `social:prepare` command converts an author-approved, due, non-draft jenp.ai letter into **PolyPost's native version-1 draft-library backup**. This is a working import/export integration, not a headless publishing API, vendored fork, installed extension, or connection to social accounts.

Upstream sources were examined at [commit 86afeeee05dde6836b588fd04b11beac8517ec50](https://github.com/markrussinovich/Polypost/tree/86afeeee05dde6836b588fd04b11beac8517ec50):

- [README: capabilities and manual publishing boundaries](https://github.com/markrussinovich/Polypost/blob/86afeeee05dde6836b588fd04b11beac8517ec50/README.md)
- [Native backup format and additive import validation](https://github.com/markrussinovich/Polypost/blob/86afeeee05dde6836b588fd04b11beac8517ec50/src/lib/draftLibrary.ts)
- [Supported platform IDs](https://github.com/markrussinovich/Polypost/blob/86afeeee05dde6836b588fd04b11beac8517ec50/src/lib/platforms/types.ts)
- [Markdown/Word import](https://github.com/markrussinovich/Polypost/blob/86afeeee05dde6836b588fd04b11beac8517ec50/src/lib/importDocument.ts)
- [Third-party link-preview requests](https://github.com/markrussinovich/Polypost/blob/86afeeee05dde6836b588fd04b11beac8517ec50/src/lib/linkPreview.ts)

The upstream commit and format version are recorded in `config/publishing.json` and every handoff. The hosted app evolves independently; if import reports an incompatible format, stop, preserve the kit, and verify its current contract rather than inventing an API or changing browser storage directly. `post.md` is a readable fallback for manual copy/paste.

## Operating workflow

1. **Agent:** After website editorial approval, prepare a local kit:

   ```powershell
   npm run social:prepare -- my-letter --brand jennifer-perret
   ```

   It checks the source metadata, due date and both tracker approval boxes. It does **not** check whether a deployment has happened, upload anything, call an LLM, open a social composer or publish. Existing draft letters will be refused.

2. **Author:** Verify the canonical article is live and accessible to the intended audience. Open [PolyPost](https://aka.ms/Polypost), choose **Import backup**, import `polypost.json`, then restore the named `[Jennifer Perret] ...` draft from the library. Import is additive; repeating it creates another local entry rather than updating an existing draft.
3. **Author:** Select the channels actually used, review every platform card, and tailor the copy to the audience. All seven platforms are available; this is not evidence that accounts exist. PolyPost owns its live character counting and formatting warnings. This integration deliberately never truncates text to fit. Use PolyPost's thread controls if needed.
4. **Author:** Confirm the account/page and final copy for each destination. A copy-ready approval is:

   > I approve this exact social variant for `<platform>` using `<account/page>`, linking to `<canonical article URL>`. This approval does not cover other accounts, platforms or future revisions.

5. **Author:** Use **Copy** or **Copy & open** where supported and complete publication manually. Review the final native composer, link preview and image. Record the resulting post URL in `handoff.json`; a prepared or copied post is not a published post.
6. **Author or agent:** Preserve the edited kit and receipts in an approved private editorial workspace. The generated `.social` directory is local, gitignored and not a durable shared database. Do not put its contents in `public` or upload it as a public CI artifact.

No platform credentials are requested or stored by the repository tooling. Importing a kit is not approval to post. Optional PolyPost AI requires a separate provider/key decision and may send the material to that provider; this workflow does not enable it. Do not send confidential material to external AI endpoints.

**Public URLs only:** Restoring a PolyPost draft can request third-party previews (Microlink) and site icons, even with AI disabled. Do not include private/staging links, signed URLs or secrets in a handoff. Preview services can rate-limit independently; a missing preview does not mean the import failed. The native import and all seven platform overrides were exercised using synthetic content only; nothing was posted and no AI endpoint was configured.

## Kit contents

Each preparation gets a fresh directory, preserving older edits and receipts:

```text
.social/<brand>/<letter-slug>/<timestamp>-<content-hash>/
  polypost.json
  post.md
  handoff.json
```

| File | Purpose |
| --- | --- |
| `polypost.json` | One named master draft, seven editable platform overrides, enabled platform IDs, and no credentials, original article body or private sources |
| `post.md` | Human-readable channel variants for review or manual copy; do not paste the whole multi-section file as one social post |
| `handoff.json` | Brand, canonical URL, source-content hash, upstream contract, optional approved image reference and per-destination approval/account/receipt placeholders |

Default copy uses the article title and summary. `social.text` overrides the master introduction; `social.variants.<platform>` overrides one platform's introduction. The canonical link is appended automatically. Keep URLs out of introduction fields unless additional references are intentional.

Each platform variant gets:

```text
utm_source=<platform>
utm_medium=social
utm_campaign=<brand>-<letter-slug>
```

The canonical website URL itself stays clean. UTM parameters enable later attribution with a separately approved analytics setup; they do not collect analytics by themselves. There is no analytics vendor installed here.

The kit starts as `awaiting-social-review`; every destination has `account: null`, `approved: false` and `publishedUrl: null`. Fill these only after the actual decision/action. Add reviewer/date, final copy and receipt context to the private record. The source hash identifies the originating content; changes after approval require a fresh review, not reuse of an old approval.

An optional hero image is listed by URL and alt text in the handoff, not downloaded or silently uploaded. Attach it through PolyPost's media controls or the destination composer and verify platform alt-text support. The website preview image is separately supplied by Open Graph metadata.

## Channel-specific cautions

| Destination | Publishing boundary |
| --- | --- |
| LinkedIn | PolyPost's optional extension is LinkedIn-only and posts through LinkedIn's UI when the user clicks Post. It is not installed here. Prefer the web-app/manual flow first; do not assume company-page support or posting permissions. |
| X, Bluesky, Threads | Copy/open can prefill where supported. Threads require publishing segments manually as replies; PolyPost does not automatically connect them. |
| Mastodon | Confirm the intended instance/account and its limits before opening the composer. |
| Facebook | Confirm personal profile versus company/page destination in the native UI. |
| Instagram | Plan suitable media and an appropriate link destination; a caption URL is not equivalent to a clickable feed link. No image upload is automated. |
| Substack | Separate, manual newsletter/full-article distribution. Not a PolyPost-supported platform in the examined interface. |

For several brands, use distinct browser profiles or clearly separated sessions and named drafts. A brand label is not technical account isolation. Never infer that the account currently signed in is the approved publishing identity.

## Canonical articles versus distribution copies

Keep the full article on its owning brand's site. Social introductions should stand alone, fit the destination and link to that canonical article. If manually republishing full text on another publishing platform, use that platform's supported original-source/canonical settings where available and verify its behavior; there is no universal cross-post canonical API.

Follow the [LinkedIn GTM proposal](linkedin-gtm-proposal.md): founder perspective, business offers and product evidence need different framing. Do not create the same promotional post under three identities. Product roadmap remains roadmap; a successful tooling check is not proof that a product capability shipped.
