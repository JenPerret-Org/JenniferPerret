import { getCollection } from 'astro:content';
import { isPublished } from './publishing.mjs';

export async function getLetters(preview = import.meta.env.DEV) {
  const now = new Date();
  const posts = await getCollection('letter', ({ data }) => preview || isPublished(data, now));
  return posts.sort((a, b) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}
