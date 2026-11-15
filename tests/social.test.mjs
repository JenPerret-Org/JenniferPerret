import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepareSocial } from '../scripts/polypost.mjs';
import { getBrand, publishing } from '../src/lib/brand-config.mjs';
import { letterSchema } from '../src/lib/publishing.mjs';

const now = new Date('2026-11-15T00:00:00Z');
const post = {
  id: 'test-letter',
  body: 'Full article body stays out of the social handoff.',
  data: letterSchema.parse({
    title: 'A useful letter', description: 'A short summary.', pubDate: '2020-01-02',
    pillar: 'agents-coding', draft: false,
    social: { variants: { linkedin: 'A tailored LinkedIn introduction.' } },
  }),
};

const text = (document) => document.content.map((paragraph) => paragraph.content?.[0]?.text ?? '').join('\n');

test('native PolyPost backup contains one named draft and complete platform-specific documents', () => {
  const kit = prepareSocial(post, 'jennifer-perret', now);
  assert.equal(kit.backup.format, 'polypost-backup');
  assert.equal(kit.backup.version, 1);
  assert.equal(kit.backup.drafts.length, 1);
  const [draft] = kit.backup.drafts;
  assert.equal(draft.kind, 'draft');
  assert.equal(draft.document.type, 'doc');
  assert.equal(draft.title, '[Jennifer Perret] A useful letter');
  assert.equal(draft.createdAt, now.valueOf());
  assert.deepEqual(draft.enabledPlatforms, getBrand().platforms);
  assert.deepEqual(Object.keys(draft.overrides), getBrand().platforms);
  for (const [platform, document] of Object.entries(draft.overrides)) {
    assert.equal(document.type, 'doc');
    const url = new URL(text(document).split('\n').at(-1));
    assert.equal(url.origin, 'https://www.jenperret.com');
    assert.equal(url.pathname, '/letter/test-letter');
    assert.equal(url.searchParams.get('utm_source'), platform);
    assert.equal(url.searchParams.get('utm_medium'), 'social');
    assert.equal(url.searchParams.get('utm_campaign'), 'jennifer-perret-test-letter');
  }
  assert.match(text(draft.overrides.linkedin), /^A tailored LinkedIn introduction/);
  assert.match(text(draft.overrides.x), /^A useful letter/);
  assert.deepEqual(draft.sources, []);
  assert.deepEqual(draft.attachments, []);
  assert.equal(kit.handoff.status, 'awaiting-social-review');
  assert.equal(kit.handoff.polypost.verifiedCommit, publishing.polypost.verifiedCommit);
  assert(kit.handoff.destinations.every((destination) => !destination.approved && destination.account === null && destination.publishedUrl === null));
  assert(!JSON.stringify(kit).includes(post.body));
});

test('staging builds use the staging host while social links always point to production', () => {
  assert.equal(getBrand(undefined, { environment: 'staging' }).site, 'https://staging.jenperret.com');
  assert.equal(getBrand(undefined, { environment: 'production' }).site, 'https://www.jenperret.com');
  assert.throws(() => getBrand(undefined, { environment: 'preview' }), /Unknown DEPLOY_ENV/);
  const previous = process.env.DEPLOY_ENV;
  process.env.DEPLOY_ENV = 'staging';
  try {
    const kit = prepareSocial(post, undefined, now);
    assert.equal(new URL(text(kit.backup.drafts[0].overrides.x).split('\n').at(-1)).origin, 'https://www.jenperret.com');
  } finally {
    if (previous === undefined) delete process.env.DEPLOY_ENV; else process.env.DEPLOY_ENV = previous;
  }
});

test('drafts, future posts, unknown brands, and unconfigured business/product brands cannot be exported', () => {
  assert.throws(() => prepareSocial({ ...post, data: { ...post.data, draft: true } }, undefined, now), /non-draft/);
  assert.throws(() => prepareSocial({ ...post, data: { ...post.data, pubDate: new Date('2099-01-01') } }, undefined, now), /publication date/);
  assert.throws(() => prepareSocial(post, 'unknown', now), /Unknown brand/);
  for (const brand of ['aicraftworks', 'agentcraftworks']) {
    assert.throws(() => prepareSocial(post, brand, now), /planned, not activated/);
  }
});

test('content hashes detect editorial and social-copy changes without truncating over-limit text', () => {
  const original = prepareSocial(post, undefined, now);
  const changed = prepareSocial({ ...post, body: `${post.body} Changed.` }, undefined, now);
  assert.notEqual(changed.handoff.contentHash, original.handoff.contentHash);
  const long = 'Long copy '.repeat(400);
  const kit = prepareSocial({ ...post, data: { ...post.data, social: { text: long } } }, undefined, now);
  assert(text(kit.backup.drafts[0].overrides.x).startsWith(long));
  assert.notEqual(kit.handoff.contentHash, original.handoff.contentHash);
});
