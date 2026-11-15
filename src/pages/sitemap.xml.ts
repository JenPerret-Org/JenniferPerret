import type { APIContext } from 'astro';
import { getLetters } from '../lib/letters';
import { canonicalUrl, letterPath, pillars, tagTopics } from '../lib/publishing.mjs';

export async function GET({ site }: APIContext) {
  const posts = await getLetters(false);
  const paths = ['/', '/about', '/projects', '/letter', '/letter/topics', '/search',
    ...Object.keys(pillars).map((pillar) => `/letter/pillars/${pillar}`),
    ...tagTopics(posts).map((tag) => `/letter/tags/${tag.slug}`),
    ...posts.map((post) => letterPath(post.id))];
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) =>
    `<url><loc>${escape(canonicalUrl(path, site!))}</loc></url>`).join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
