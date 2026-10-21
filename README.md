# Jennifer Perret — jenp.ai

Personal site and weekly letter, built with Astro and deployed to GitHub Pages.

## Go-live checklist

Repository configuration uses **https://jenp.ai** as the primary domain.
`astro.config.mjs` controls canonical and RSS URLs; `public/CNAME` contains
`jenp.ai`. Subscribe links use **https://jenp.substack.com**.

These account-level steps must be completed by the owner:

- [ ] In repository **Settings → Pages**, select **GitHub Actions** as the source.
- [ ] At the DNS provider for `jenp.ai`, add apex (`@`) A records for
  `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
  Set `www` to a CNAME pointing to `jenperret-org.github.io` (not a URL).
  Remove conflicting apex or `www` records.
- [ ] In **Settings → Pages**, set the custom domain to `jenp.ai`. Wait for DNS
  validation and certificate provisioning, then enable **Enforce HTTPS**.
  GitHub Pages redirects `www.jenp.ai` to the apex when both are configured.
- [ ] Configure **permanent HTTP 301/308 forwarding**, without masking, from
  `jenniferperret.com` and `www.jenniferperret.com` to `https://jenp.ai`.
  Use a registrar/redirect host that supports TLS for both old hostnames and
  preserves paths and query strings (for example,
  `https://jenniferperret.com/about?ref=old` → `https://jenp.ai/about?ref=old`).
  Follow that provider's DNS instructions for the old domain. DNS records alone
  cannot redirect URLs; do not add the old domain to this site's CNAME file.
- [ ] Confirm a green **Deploy to GitHub Pages** run after merging to `main`
  (or trigger it manually), then check HTTPS and redirects on the live domains.
- [ ] Create or confirm ownership of `jenp.substack.com` and test subscribing.
  If the handle changes, update the links in `src/pages/index.astro`,
  `src/pages/letter/index.astro`, `src/pages/letter/[...slug].astro`, and
  `src/pages/about.astro`.
- [ ] Review the bio in `src/pages/about.astro` and project descriptions and
  destinations in `src/pages/projects.astro`; two projects still use `#`
  placeholders and need real links or removal before launch.
- [ ] Approve the first letter using `WRITING-POLICY.md` and
  `DRAFT-REVIEW-TRACKER.md`, then set `draft: false` in
  `src/content/letter/000-why-im-starting-this.md`. The original `001` intro
  was renamed to `000`. No letters are currently approved; drafts are excluded
  from listings, individual pages, and RSS.
- [ ] Check the homepage, About, Projects, letter archive, an approved letter,
  and `/rss.xml` on desktop and mobile. Verify navigation, subscription links,
  favicon, and social previews (`public/images/og.png`).

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

Use Node.js **22.12.0 or newer** (the deployment workflow uses Node 22).
All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm ci`                  | Installs locked dependencies                     |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
