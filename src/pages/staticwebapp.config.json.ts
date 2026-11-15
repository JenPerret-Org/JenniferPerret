import { deployEnvironment } from '../lib/brand-config.mjs';

export function GET() {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
  if (deployEnvironment() === 'staging') headers['X-Robots-Tag'] = 'noindex, nofollow';
  const config = {
    trailingSlash: 'auto',
    responseOverrides: { 404: { rewrite: '/404.html' } },
    globalHeaders: headers,
  };
  return new Response(`${JSON.stringify(config, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
