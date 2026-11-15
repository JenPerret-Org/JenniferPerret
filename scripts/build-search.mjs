import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { close, createIndex } from 'pagefind';
import { parseHTML } from 'linkedom';
import { isMain } from './cli.mjs';
import { pillars } from '../src/lib/publishing.mjs';

/** @param {string} [root] */
export async function buildSearch(root = process.cwd()) {
  const dist = path.join(root, 'dist');
  const posts = JSON.parse(await readFile(path.join(dist, 'posts.json'), 'utf8'));
  if (!posts.length) {
    console.log('No published letters: search stays empty.');
    return;
  }
  const { index, errors } = await createIndex();
  if (errors.length || !index) throw new Error(`Could not create search index: ${errors.join('; ')}`);
  try {
    for (const post of posts) {
      const { document } = parseHTML(await readFile(path.join(dist, 'letter', post.id, 'index.html'), 'utf8'));
      const body = document.querySelector('[data-pagefind-body]');
      if (!body) throw new Error(`Missing searchable article body: ${post.id}`);
      for (const block of body.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, tr, br')) {
        block.after('\n');
      }
      const result = await index.addCustomRecord({
        url: new URL(post.url).pathname,
        content: `${post.title}\n${post.description}\n${body.textContent}`,
        language: 'en',
        meta: { title: post.title },
        filters: { pillar: [pillars[post.pillar].label], tag: post.tags },
      });
      if (result.errors.length) throw new Error(`Search indexing failed for ${post.id}: ${result.errors.join('; ')}`);
    }
    const result = await index.writeFiles({ outputPath: path.join(dist, 'pagefind') });
    if (result.errors.length) throw new Error(`Search output failed: ${result.errors.join('; ')}`);
    console.log(`Indexed ${posts.length} published letters.`);
  } finally {
    await index.deleteIndex();
    await close();
  }
}

if (isMain(import.meta.url)) await buildSearch();
