import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertEditorialApproval, parseLetter } from '../scripts/content.mjs';
import { assertSlug } from '../scripts/cli.mjs';
import { resolveLocalTarget } from '../scripts/check-site.mjs';
import { isPublished, letterSchema, tagTopics } from '../src/lib/publishing.mjs';

const data = { title: 'A letter', description: 'A useful summary', pubDate: '2020-01-02', pillar: 'agents-coding' };

test('publication is opt-in and excludes future posts at the exact date boundary', () => {
  const post = letterSchema.parse(data);
  const now = new Date('2020-01-02T00:00:00Z');
  assert.equal(post.draft, true);
  assert.equal(isPublished(post, now), false);
  assert.equal(isPublished({ ...post, draft: false }, now), true);
  assert.equal(isPublished({ ...post, draft: false }, new Date(now.valueOf() - 1)), false);
  assert.throws(() => letterSchema.parse({ ...data, pubDate: 'not a date' }));
  assert.throws(() => letterSchema.parse({ ...data, heroImage: '/images/hero.jpg' }), /heroImageAlt/);
});

test('YAML parsing preserves the body, handles BOM/CRLF and never treats missing flags as publishable', () => {
  const source = '\uFEFF---\r\ntitle: A letter\r\ndescription: Summary\r\npubDate: 2020-01-02\r\npillar: ai-general\r\n---\r\nBody\n---\nStill body';
  const parsed = parseLetter(source);
  assert.equal(parsed.data.draft, true);
  assert.equal(parsed.body, 'Body\n---\nStill body');
  assert.throws(() => parseLetter('No front matter'), /YAML front matter/);
  assert.throws(() => parseLetter('---\ntitle: [broken\n---\n'), /flow sequence/i);
});

test('non-drafts require one author-reviewed and author-approved tracker entry', () => {
  const posts = [{ id: 'my-letter', data: { draft: false } }];
  const row = '| - | [Title](src/content/letter/my-letter.md) | 2020-01-02 | [x] | [x] | Approved by author |';
  assert.doesNotThrow(() => assertEditorialApproval(posts, row));
  assert.throws(() => assertEditorialApproval(posts, row.replace('[x]', '[ ]')), /Reviewed and Approved/);
  assert.throws(() => assertEditorialApproval(posts, ''), /exactly one/);
  assert.throws(() => assertEditorialApproval(posts, `${row}\n${row}`), /exactly one/);
  assert.doesNotThrow(() => assertEditorialApproval([{ id: 'private', data: { draft: true } }], ''));
});

test('local link checking is case-sensitive, checks real files, and preserves fragment targets', () => {
  const files = new Set(['index.html', 'letter/test/index.html', 'images/photo.jpg', 'letter/test/assets/photo.jpg']);
  const resolve = (url) => resolveLocalTarget(url, '/letter/test', files, 'https://www.jenperret.com');
  assert.deepEqual(resolve('/letter/test?utm_source=x#section'), { file: 'letter/test/index.html', fragment: 'section' });
  assert.deepEqual(resolve('/images/photo.jpg'), { file: 'images/photo.jpg', fragment: '' });
  assert.equal(resolve('https://example.com/elsewhere'), null);
  assert.equal(resolveLocalTarget('assets/photo.jpg', '/letter/test/', files, 'https://www.jenperret.com').file, 'letter/test/assets/photo.jpg');
  assert.throws(() => resolve('/images/Photo.jpg'), /Missing local target/);
  assert.throws(() => resolve('/letter/missing'), /Missing local target/);
});

test('tag collisions and unsafe or reserved scaffold paths fail explicitly', () => {
  assert.throws(() => tagTopics([{ id: 'one', data: { tags: ['C++', 'C#'] } }]), /collide/);
  assert.deepEqual(tagTopics([{ id: 'one', data: { tags: ['MCP', 'mcp'] } }]), [{ slug: 'mcp', label: 'MCP' }]);
  for (const slug of ['../escape', 'C:\\escape', 'topics', 'tags', 'two/levels', 'UPPER', '']) {
    assert.throws(() => assertSlug(slug));
  }
});
