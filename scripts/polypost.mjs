import { createHash } from 'node:crypto';
import { getBrand, publishing } from '../src/lib/brand-config.mjs';
import { canonicalUrl, isPublished, letterPath } from '../src/lib/publishing.mjs';
import { assertSlug } from './cli.mjs';

/** @param {string} text */
function document(text) {
  return {
    type: 'doc',
    content: text.split(/\r?\n/).map((line) => ({
      type: 'paragraph',
      ...(line ? { content: [{ type: 'text', text: line }] } : {}),
    })),
  };
}

/** @param {string} url @param {string} platform @param {string} campaign */
export function trackingUrl(url, platform, campaign) {
  const tracked = new URL(url);
  tracked.searchParams.set('utm_source', platform);
  tracked.searchParams.set('utm_medium', 'social');
  tracked.searchParams.set('utm_campaign', campaign);
  return tracked.href;
}

/**
 * Native version-1 backup contract verified against the pinned upstream draftLibrary.ts.
 * @param {Awaited<ReturnType<import('./content.mjs').readLetters>>[number]} post
 * @param {string} [brandId]
 * @param {Date} [now]
 */
export function prepareSocial(post, brandId, now = new Date()) {
  // Social posts always link to production, even when run from a staging shell.
  const brand = getBrand(brandId, { environment: 'production' });
  assertSlug(post.id);
  if (!isPublished(post.data, now)) throw new Error('Social handoff requires an approved, non-draft letter whose publication date has arrived.');
  const url = canonicalUrl(letterPath(post.id), brand.site);
  const master = post.data.social?.text ?? `${post.data.title}\n\n${post.data.description}`;
  const contentHash = createHash('sha256').update(JSON.stringify({ data: post.data, body: post.body })).digest('hex');
  const variants = Object.fromEntries(brand.platforms.map((platform) => [
    platform,
    `${post.data.social?.variants?.[platform] ?? master}\n\n${trackingUrl(url, platform, `${brand.id}-${post.id}`)}`,
  ]));
  const timestamp = now.valueOf();
  const text = `${master}\n\n${url}`;
  return {
    backup: {
      format: 'polypost-backup',
      version: publishing.polypost.backupVersion,
      exportedAt: timestamp,
      drafts: [{
        id: `${brand.id}-${post.id}-${contentHash.slice(0, 12)}`,
        kind: 'draft',
        title: `[${brand.name}] ${post.data.title}`,
        createdAt: timestamp,
        updatedAt: timestamp,
        characterCount: text.length,
        document: document(text),
        enabledPlatforms: brand.platforms,
        overrides: Object.fromEntries(Object.entries(variants).map(([platform, value]) => [platform, document(value)])),
        sources: [],
        attachments: [],
      }],
    },
    handoff: {
      brand: brand.id,
      postId: post.id,
      canonicalUrl: url,
      contentHash,
      preparedAt: now.toISOString(),
      status: 'awaiting-social-review',
      polypost: publishing.polypost,
      heroImage: post.data.heroImage ? new URL(post.data.heroImage, brand.site).href : null,
      heroImageAlt: post.data.heroImageAlt ?? null,
      destinations: brand.platforms.map((platform) => ({
        platform, account: null, approved: false, publishedUrl: null,
        trackingUrl: trackingUrl(url, platform, `${brand.id}-${post.id}`),
      })),
    },
    markdown: `# ${brand.name}: social review\n\nStatus: awaiting social approval. This file is not a publish instruction.\n\nCanonical article: ${url}\n\n` +
      Object.entries(variants).map(([platform, value]) => `## ${platform}\n\n${value}\n`).join('\n'),
  };
}
