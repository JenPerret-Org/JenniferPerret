import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('letter', ({ data }) => !data.draft);

  return rss({
    title: 'Jennifer Perret — Weekly Letter',
    description: 'AI Agentic Adventures & Misadventures — Learning in public through the messy transition to AI-driven development.',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        link: `/letter/${post.id}/`,
      })),
  });
}
