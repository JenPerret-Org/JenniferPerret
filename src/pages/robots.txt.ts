import type { APIContext } from 'astro';
import { deployEnvironment } from '../lib/brand-config.mjs';

export function GET({ site }: APIContext) {
  return new Response(import.meta.env.DEV || deployEnvironment() === 'staging'
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', site!).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
