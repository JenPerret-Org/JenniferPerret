import { z } from 'zod';

export const platforms = ['linkedin', 'x', 'bluesky', 'threads', 'mastodon', 'facebook', 'instagram'];
export const pillars = {
  'agents-coding': { label: 'Agents Writing Code', color: 'text-brand-blue' },
  'building-agents': { label: 'Building Agentic Solutions', color: 'text-brand-orange' },
  'ai-general': { label: 'AI: The Bigger Picture', color: 'text-brand-pink' },
};

/** @param {string} tag */
export function tagSlug(tag) {
  return tag.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function validateDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const [year, month, day] = value.split('-').map(Number);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth[month - 1]
    ? value
    : new Date(Number.NaN);
}

export const letterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  pubDate: z.preprocess(validateDateOnly, z.coerce.date()),
  tags: z.array(z.string().trim().min(1).refine((tag) => tagSlug(tag).length > 0, 'Tag needs a URL-safe name')).default([]),
  pillar: z.enum(['agents-coding', 'building-agents', 'ai-general']),
  draft: z.boolean().default(true),
  heroImage: z.string().regex(/^\/images\/[^?#]+$/, 'Use a local /images/ path').optional(),
  heroImageAlt: z.string().trim().min(1).optional(),
  social: z.object({
    text: z.string().trim().min(1).optional(),
    variants: z.object({
      linkedin: z.string().trim().min(1).optional(),
      x: z.string().trim().min(1).optional(),
      bluesky: z.string().trim().min(1).optional(),
      threads: z.string().trim().min(1).optional(),
      mastodon: z.string().trim().min(1).optional(),
      facebook: z.string().trim().min(1).optional(),
      instagram: z.string().trim().min(1).optional(),
    }).strict().optional(),
  }).strict().optional(),
}).refine((data) => !data.heroImage || Boolean(data.heroImageAlt), {
  message: 'A hero image needs heroImageAlt',
  path: ['heroImageAlt'],
});

/** @param {{ draft?: boolean, pubDate: Date }} data @param {Date} [now] */
export function isPublished(data, now = new Date()) {
  return data.draft === false && data.pubDate.valueOf() <= now.valueOf();
}

/** @param {string} id */
export function letterPath(id) {
  return `/letter/${id}`;
}

/** @param {string} pathname @param {URL | string} site */
export function canonicalUrl(pathname, site) {
  const url = new URL(pathname, site);
  url.search = '';
  url.hash = '';
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.href;
}

/** @template {{ id: string, data: { tags: string[] } }} T @param {T[]} posts */
export function tagTopics(posts) {
  const topics = new Map();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      const existing = topics.get(slug);
      if (existing && existing.label.toLowerCase() !== tag.toLowerCase()) {
        throw new Error(`Tags "${existing.label}" and "${tag}" collide at /letter/tags/${slug}`);
      }
      topics.set(slug, { slug, label: existing?.label ?? tag });
    }
  }
  return [...topics.values()].sort((a, b) => a.label.localeCompare(b.label));
}
