import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { stringify } from 'yaml';
import { checkSite } from '../scripts/check-site.mjs';
import { createPost } from '../scripts/new-post.mjs';
import { writeSocialKit } from '../scripts/prepare-social.mjs';
import { parseLetter } from '../scripts/content.mjs';

const run = promisify(execFile);
const repository = fileURLToPath(new URL('../', import.meta.url));

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'jenp-publishing-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await cp(path.join(repository, 'src'), path.join(root, 'src'), {
    recursive: true,
    filter: (source) => source !== path.join(repository, 'src', 'content', 'letter'),
  });
  for (const entry of ['public', 'config', 'scripts']) {
    await cp(path.join(repository, entry), path.join(root, entry), { recursive: true });
  }
  for (const entry of ['astro.config.mjs', 'package.json', 'tsconfig.json']) {
    await cp(path.join(repository, entry), path.join(root, entry));
  }
  await symlink(path.join(repository, 'node_modules'), path.join(root, 'node_modules'), 'junction');
  await mkdir(path.join(root, 'src', 'content', 'letter'), { recursive: true });
  return root;
}

async function addLetter(root, id, options = {}) {
  const data = {
    title: `Title ${id}`, description: `Summary ${id}`, pubDate: '2020-01-02',
    pillar: 'agents-coding', tags: ['Governance'], draft: false, ...options,
  };
  await writeFile(path.join(root, 'src', 'content', 'letter', `${id}.md`),
    `---\n${stringify(data)}---\n\nSearchable quartz-orbit content.\n\n## A section\n\n[Topic](/letter/topics)\n\n![Descriptive alt](/images/messy-hold-sign-only.jpg)\n`);
}

async function build(root) {
  try {
    await run(process.execPath, ['scripts/validate-content.mjs'], { cwd: root });
    await run(process.execPath, [path.join(repository, 'node_modules', 'astro', 'bin', 'astro.mjs'), 'build'], { cwd: root });
    await run(process.execPath, ['scripts/build-search.mjs'], { cwd: root });
    await checkSite(root);
  } catch (error) {
    throw new Error(`${error.message}\n${error.stdout ?? ''}\n${error.stderr ?? ''}`, { cause: error });
  }
}

test('real production build excludes unpublished content everywhere and generates working discovery assets', { timeout: 120000 }, async (t) => {
  const root = await fixture(t);
  await addLetter(root, 'published');
  await addLetter(root, 'private-draft', { draft: true, title: 'UNPUBLISHED_DRAFT_SENTINEL' });
  await addLetter(root, 'future', { draft: true, title: 'UNPUBLISHED_FUTURE_SENTINEL', pubDate: '2099-01-01' });
  await addLetter(root, 'unscheduled', { draft: false, title: 'UNPUBLISHED_SCHEDULED_SENTINEL', pubDate: '2099-01-01' });
  await writeFile(path.join(root, 'DRAFT-REVIEW-TRACKER.md'), `# Review tracker\n\n| # | Draft | Date | Reviewed | Approved | Notes |\n| - | [Published](src/content/letter/published.md) | 2020-01-02 | [x] | [x] | Fixture |\n| - | [Scheduled](src/content/letter/unscheduled.md) | 2099-01-01 | [x] | [x] | Fixture |\n\n## Progress\n\n- Reviewed: 2 / 4\n- Approved: 2 / 4\n`);
  await build(root);
  const dist = path.join(root, 'dist');
  const expectedOrigin = process.env.DEPLOY_ENV === 'staging' ? 'https://staging.jenperret.com' : 'https://www.jenperret.com';
  const home = await readFile(path.join(dist, 'index.html'), 'utf8');
  assert(home.includes(`rel="canonical" href="${expectedOrigin}/"`));
  assert(home.includes(`property="og:url" content="${expectedOrigin}/"`));
  const posts = JSON.parse(await readFile(path.join(dist, 'posts.json'), 'utf8'));
  assert.deepEqual(posts.map((post) => post.id), ['published']);
  assert.equal(posts[0].url, `${expectedOrigin}/letter/published`);
  assert((await readFile(path.join(dist, 'rss.xml'), 'utf8')).includes(`${expectedOrigin}/letter/published`));
  const hosting = JSON.parse(await readFile(path.join(dist, 'staticwebapp.config.json'), 'utf8'));
  assert.equal(hosting.globalHeaders['X-Robots-Tag'], process.env.DEPLOY_ENV === 'staging' ? 'noindex, nofollow' : undefined);
  const searchEntry = JSON.parse(await readFile(path.join(dist, 'pagefind', 'pagefind-entry.json'), 'utf8'));
  assert.equal(searchEntry.languages.en.page_count, 1);
  for (const file of ['index.html', 'letter/index.html', 'letter/topics/index.html', 'rss.xml', 'sitemap.xml', 'posts.json']) {
    assert(!/UNPUBLISHED_(DRAFT|FUTURE|SCHEDULED)_SENTINEL/.test(await readFile(path.join(dist, file), 'utf8')), file);
  }
  await assert.rejects(readFile(path.join(dist, 'letter', 'private-draft', 'index.html')), { code: 'ENOENT' });
  const articlePath = path.join(dist, 'letter', 'published', 'index.html');
  const original = await readFile(articlePath, 'utf8');
  await writeFile(articlePath, original.replace('/images/messy-hold-sign-only.jpg', '/images/Missing.jpg'));
  await assert.rejects(checkSite(root), /Missing local target/);
  await writeFile(articlePath, original.replace('rel="canonical"', 'rel="not-canonical"'));
  await assert.rejects(checkSite(root), /incorrect canonical/);
  await writeFile(articlePath, original);
  const feedPath = path.join(dist, 'rss.xml');
  const feed = await readFile(feedPath, 'utf8');
  await writeFile(feedPath, feed.replace('</rss>', ''));
  await assert.rejects(checkSite(root), /RSS must be valid XML/);
  await writeFile(feedPath, feed);
  const kitPath = await writeSocialKit('published', 'jennifer-perret', root);
  const backup = JSON.parse(await readFile(path.join(kitPath, 'polypost.json'), 'utf8'));
  assert.equal(backup.drafts[0].title, '[Jennifer Perret] Title published');
  await assert.rejects(writeSocialKit('private-draft', undefined, root), /non-draft/);
  await assert.rejects(writeSocialKit('unscheduled', undefined, root), /publication date/);
});

test('post scaffolding creates a draft and unapproved tracker row without overwriting existing work', async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'jenp-post-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'src', 'content', 'letter'), { recursive: true });
  await writeFile(path.join(root, 'DRAFT-REVIEW-TRACKER.md'),
    '# Review tracker\n\n| # | Draft | Date | Reviewed | Approved | Notes |\n| --- | --- | --- | --- | --- | --- |\n\n## Progress\n\n- Reviewed: 0 / 0\n- Approved: 0 / 0\n');
  const options = { slug: 'new-letter', title: 'A title: with punctuation', date: '2026-11-14', tags: 'governance,AI' };
  const file = await createPost(options, root);
  const created = parseLetter(await readFile(file, 'utf8'));
  assert.equal(created.data.draft, true);
  assert.equal(created.data.title, options.title);
  assert.deepEqual(created.data.tags, ['governance', 'AI']);
  const tracker = await readFile(path.join(root, 'DRAFT-REVIEW-TRACKER.md'), 'utf8');
  assert.match(tracker, /\| 2026-11-14 \| \[ \] \| \[ \] \|/);
  assert.match(tracker, /Approved: 0 \/ 1/);
  await assert.rejects(createPost(options, root), /already has a review-tracker entry/);
  await assert.rejects(createPost({ ...options, slug: 'invalid', date: '2026-02-31' }, root), /valid YYYY-MM-DD/);
  await assert.rejects(createPost({ ...options, slug: 'invalid', date: '2026-99-99' }, root), /valid YYYY-MM-DD/);
  assert.deepEqual(await readdir(path.dirname(file)), ['new-letter.md']);
});
