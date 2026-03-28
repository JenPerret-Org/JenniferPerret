import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const letter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/letter' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    pillar: z.enum(['agents-coding', 'building-agents', 'ai-general']),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
  }),
});

export const collections = { letter };
