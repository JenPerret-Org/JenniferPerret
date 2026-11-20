import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { DOMParser, parseHTML } from 'linkedom';
import { SyntaxValidator } from 'fast-xml-validator';
import { getBrand } from '../src/lib/brand-config.mjs';
import { canonicalUrl, isPublished, letterPath } from '../src/lib/publishing.mjs';
import { assertEditorialApproval, readLetters, walk } from './content.mjs';
import { isMain } from './cli.mjs';

/** @param {string} file */
export function outputPath(file) {
  if (file === 'index.html') return '/';
  return `/${file.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

/**
 * Validate local targets against an exact-case output manifest, even on Windows.
 * @param {string} value @param {string} from @param {Set<string>} files @param {string} site
 */
export function resolveLocalTarget(value, from, files, site) {
  const url = new URL(value, new URL(from, site));
  if (url.origin !== new URL(site).origin) return null;
  const relative = decodeURIComponent(url.pathname).replace(/^\/+|\/+$/g, '');
  const target = [relative || 'index.html', `${relative}/index.html`, `${relative}.html`]
    .find((candidate) => files.has(candidate));
  assert(target, `Missing local target (including case): ${value} from ${from}`);
  return { file: target, fragment: decodeURIComponent(url.hash.slice(1)) };
}

/** @param {string} source @param {string} label */
function validateXml(source, label) {
  try {
    SyntaxValidator.validate(source, {
      multipleRoots: false,
      invalidCharSequence: { comment: true, tagValue: true, attrLt: true },
    });
  } catch (error) {
    if (!(error instanceof Error) || error.name !== 'ValidationError') throw error;
    throw new Error(`${label} must be valid XML: ${error.message}`, { cause: error });
  }
}

/** @param {string} [root] */
export async function checkSite(root = process.cwd()) {
  const dist = path.join(root, 'dist');
  const brand = getBrand();
  const source = await readLetters(root);
  assertEditorialApproval(source, await readFile(path.join(root, 'DRAFT-REVIEW-TRACKER.md'), 'utf8'));
  const posts = source.filter((post) => isPublished(post.data));
  const files = new Set((await walk(dist)).map((file) => path.relative(dist, file).split(path.sep).join('/')));
  assert(!files.has('CNAME'), 'Legacy GitHub Pages CNAME must not be included in Azure output');
  const html = new Map();
  const indexable = new Set();
  for (const file of files) {
    if (!file.endsWith('.html')) continue;
    const text = await readFile(path.join(dist, file), 'utf8');
    const { document } = parseHTML(text);
    html.set(file, document);
    const route = outputPath(file);
    const expected = canonicalUrl(route, brand.site);
    assert.equal(document.querySelectorAll('h1').length, 1, `${file}: expected one h1`);
    assert(document.querySelector('title')?.textContent?.trim(), `${file}: missing title`);
    assert(document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim(), `${file}: missing description`);
    assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute('href'), expected, `${file}: incorrect canonical`);
    assert.equal(document.querySelector('meta[property="og:url"]')?.getAttribute('content'), expected, `${file}: incorrect OG URL`);
    const noindex = document.querySelector('meta[name="robots"]')?.getAttribute('content')?.includes('noindex');
    assert.equal(Boolean(noindex), route === '/404', `${file}: unexpected robots directive`);
    if (!noindex) indexable.add(expected);
    assert(!text.includes('Local editorial preview:'), `${file}: editorial preview leaked`);
    for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
      const image = document.querySelector(selector)?.getAttribute('content');
      assert(image, `${file}: missing sharing image`);
      resolveLocalTarget(image, route, files, brand.site);
    }
  }
  for (const [file, document] of html) {
    const route = file.endsWith('/index.html') ? `${outputPath(file)}/` : outputPath(file);
    for (const element of document.querySelectorAll('a[href], link[href], img[src], script[src], source[src]')) {
      const value = element.getAttribute('href') ?? element.getAttribute('src');
      if (!value || /^(mailto:|tel:|data:)/i.test(value)) continue;
      assert(!/^(javascript:|vbscript:)/i.test(value), `${file}: unsafe URL`);
      const target = resolveLocalTarget(value, route, files, brand.site);
      if (target?.fragment && html.has(target.file)) {
        assert(html.get(target.file).getElementById(target.fragment), `${file}: missing anchor ${value}`);
      }
    }
    for (const image of document.querySelectorAll('img')) {
      assert(image.hasAttribute('alt'), `${file}: image is missing alt text`);
    }
  }
  for (const post of source.filter((entry) => !isPublished(entry.data))) {
    assert(!files.has(`letter/${post.id}/index.html`), `Unpublished route leaked: ${post.id}`);
    assert(!files.has(`letter/${post.id}.html`), `Unpublished route leaked: ${post.id}`);
  }
  const manifest = JSON.parse(await readFile(path.join(dist, 'posts.json'), 'utf8'));
  assert.deepEqual(manifest.map((post) => post.id).sort(), posts.map((post) => post.id).sort(), 'Public manifest must contain exactly the published letters');
  for (const post of posts) {
    const file = `letter/${post.id}/index.html`;
    assert(files.has(file), `Published route missing: ${post.id}`);
    const entry = manifest.find((item) => item.id === post.id);
    const expected = canonicalUrl(letterPath(post.id), brand.site);
    assert.equal(entry.url, expected, `Incorrect manifest URL: ${post.id}`);
    assert.equal(entry.title, post.data.title, `Incorrect manifest title: ${post.id}`);
    assert.equal(entry.pubDate, post.data.pubDate.toISOString(), `Incorrect manifest date: ${post.id}`);
    assert.equal(html.get(file).querySelector('meta[property="og:type"]')?.getAttribute('content'), 'article', `${file}: incorrect OG type`);
    assert.equal(html.get(file).querySelector('meta[property="article:published_time"]')?.getAttribute('content'), entry.pubDate, `${file}: missing article date`);
  }
  const xml = new DOMParser();
  const sitemapSource = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  validateXml(sitemapSource, 'Sitemap');
  const sitemap = xml.parseFromString(sitemapSource, 'text/xml');
  const locations = [...sitemap.querySelectorAll('loc')].map((node) => node.textContent);
  assert.equal(new Set(locations).size, locations.length, 'Duplicate sitemap location');
  assert.deepEqual([...locations].sort(), [...indexable].sort(), 'Sitemap must match indexable HTML pages');
  const feedSource = await readFile(path.join(dist, 'rss.xml'), 'utf8');
  validateXml(feedSource, 'RSS');
  const rss = xml.parseFromString(feedSource, 'text/xml');
  const feedUrls = [...rss.querySelectorAll('item > link')].map((node) => node.textContent.replace(/\/$/, ''));
  assert.deepEqual(feedUrls.sort(), posts.map((post) => canonicalUrl(letterPath(post.id), brand.site)).sort(), 'RSS must contain exactly the published letters');
  if (posts.length) {
    for (const asset of ['pagefind.js', 'pagefind-ui.js', 'pagefind-ui.css', 'pagefind-entry.json']) {
      assert(files.has(`pagefind/${asset}`), `Missing search asset: ${asset}`);
    }
  } else {
    assert(![...files].some((file) => file.startsWith('pagefind/')), 'Empty site must not retain a stale search index');
  }
  const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
  if (brand.environment === 'staging') {
    assert.match(robots, /^Disallow: \/$/m, 'Staging robots.txt must block crawlers');
  } else {
    assert(robots.includes(`Sitemap: ${new URL('/sitemap.xml', brand.site).href}`), 'Missing robots sitemap');
  }
  assert(files.has('staticwebapp.config.json'), 'Missing Azure Static Web Apps configuration');
  const swaHeaders = JSON.parse(await readFile(path.join(dist, 'staticwebapp.config.json'), 'utf8')).globalHeaders ?? {};
  assert.equal(swaHeaders['X-Robots-Tag'], brand.environment === 'staging' ? 'noindex, nofollow' : undefined, 'Only staging may send X-Robots-Tag');
  assert(![...files].some((file) => file.startsWith('.social/') || file.endsWith('.md') && file.startsWith('letter/')), 'Private source or social kit leaked into output');
  console.log(`Checked ${html.size} pages, local links/images, ${posts.length} published letters, draft exclusion, feeds, sitemap, and search assets.`);
}

if (isMain(import.meta.url)) await checkSite();
