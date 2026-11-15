import type { APIContext } from 'astro';
import { getLetters } from '../lib/letters';
import { canonicalUrl, letterPath } from '../lib/publishing.mjs';

export async function GET({ site }: APIContext) {
  const posts = await getLetters(false);
  return Response.json(posts.map((post) => ({
    id: post.id,
    title: post.data.title,
    description: post.data.description,
    url: canonicalUrl(letterPath(post.id), site!),
    pubDate: post.data.pubDate.toISOString(),
    tags: post.data.tags,
    pillar: post.data.pillar,
  })));
}
