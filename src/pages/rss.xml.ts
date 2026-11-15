import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getLetters } from '../lib/letters';
import { canonicalUrl, letterPath } from '../lib/publishing.mjs';

export async function GET({ site }: APIContext) {
  const posts = await getLetters(false);
  return rss({
    title: 'Jennifer Perret — The Weekly Letter',
    description: 'AI Agentic Adventures & Misadventures — learning in public.',
    site: site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: canonicalUrl(letterPath(post.id), site!),
    })),
    customData: '<language>en-us</language>',
  });
}
