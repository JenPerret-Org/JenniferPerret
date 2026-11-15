import { pathToFileURL } from 'node:url';
import path from 'node:path';

/** @param {string} url */
export function isMain(url) {
  return Boolean(process.argv[1]) && url === pathToFileURL(path.resolve(process.argv[1])).href;
}

/** @param {unknown} slug */
export function assertSlug(slug) {
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Supply a flat kebab-case slug, for example my-next-letter.');
  }
  if (['index', 'topics', 'tags', 'pillars'].includes(slug)) throw new Error(`Reserved letter slug: ${slug}`);
  return slug;
}
