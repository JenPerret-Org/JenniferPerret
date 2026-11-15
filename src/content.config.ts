import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { letterSchema } from './lib/publishing.mjs';

const letter = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/letter' }),
  schema: letterSchema,
});

export const collections = { letter };
