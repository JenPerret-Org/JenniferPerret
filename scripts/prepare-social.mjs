import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { assertEditorialApproval, readLetters } from './content.mjs';
import { assertSlug, isMain } from './cli.mjs';
import { getBrand } from '../src/lib/brand-config.mjs';
import { prepareSocial } from './polypost.mjs';

/** @param {string} slug @param {string} [brandId] @param {string} [root] */
export async function writeSocialKit(slug, brandId, root = process.cwd()) {
  assertSlug(slug);
  const brand = getBrand(brandId);
  const posts = await readLetters(root);
  const post = posts.find((entry) => entry.id === slug);
  if (!post) throw new Error(`Letter not found: ${slug}`);
  assertEditorialApproval([post], await readFile(path.join(root, 'DRAFT-REVIEW-TRACKER.md'), 'utf8'));
  const kit = prepareSocial(post, brand.id);
  const parent = path.join(root, '.social', brand.id, slug);
  await mkdir(parent, { recursive: true });
  // A unique directory keeps previous edits, approvals and receipts intact.
  const output = path.join(parent, `${Date.now()}-${kit.handoff.contentHash.slice(0, 12)}`);
  await mkdir(output);
  await writeFile(path.join(output, 'polypost.json'), `${JSON.stringify(kit.backup, null, 2)}\n`, { flag: 'wx' });
  await writeFile(path.join(output, 'handoff.json'), `${JSON.stringify(kit.handoff, null, 2)}\n`, { flag: 'wx' });
  await writeFile(path.join(output, 'post.md'), kit.markdown, { flag: 'wx' });
  return output;
}

if (isMain(import.meta.url)) {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { brand: { type: 'string' } },
  });
  if (positionals.length !== 1) throw new Error('Usage: npm run social:prepare -- my-letter --brand jennifer-perret');
  console.log(`Prepared local PolyPost kit: ${await writeSocialKit(positionals[0], values.brand)}`);
  console.log('Nothing was uploaded or posted. Verify the article is live, then import polypost.json using PolyPost Import backup.');
  console.log('PolyPost may fetch third-party link previews after restoring a draft. Use only public URLs.');
  console.log('Restore the named draft, review each platform/account, and explicitly approve before posting. Record final URLs in handoff.json.');
}
