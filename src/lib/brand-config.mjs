import { z } from 'zod';
import config from '../../config/publishing.json' with { type: 'json' };
import { platforms } from './publishing.mjs';

const brandSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1),
  status: z.enum(['active', 'planned']),
  site: z.url().nullable(),
  stagingSite: z.url().nullable().optional(),
  contentDirectory: z.string().nullable(),
  platforms: z.array(z.enum(platforms)).refine((entries) => new Set(entries).size === entries.length, 'Duplicate platform'),
});

export const publishing = z.object({
  activeBrand: z.string(),
  polypost: z.object({
    url: z.url(),
    repository: z.url(),
    verifiedCommit: z.string().regex(/^[a-f0-9]{40}$/),
    backupVersion: z.literal(1),
  }),
  brands: z.array(brandSchema),
}).parse(config);

export const environments = ['production', 'staging'];

/** @param {string | undefined} [value] */
export function deployEnvironment(value = process.env.DEPLOY_ENV) {
  const environment = value || 'production';
  if (!environments.includes(environment)) throw new Error(`Unknown DEPLOY_ENV: ${environment}`);
  return environment;
}

/**
 * @param {string} [id]
 * @param {{ environment?: string }} [options]
 */
export function getBrand(id = publishing.activeBrand, { environment } = {}) {
  const brand = publishing.brands.find((entry) => entry.id === id);
  if (!brand) throw new Error(`Unknown brand: ${id}`);
  if (brand.status !== 'active' || !brand.site || !brand.contentDirectory || !brand.platforms.length) {
    throw new Error(`${brand.name} is planned, not activated. Confirm its site, content repository, editorial owner, and social accounts first.`);
  }
  if (brand.id !== 'jennifer-perret' || brand.contentDirectory !== 'src/content/letter') {
    throw new Error('This checkout publishes only Jennifer Perret. Separate brand builds are a planned adaptation, not enabled by changing a domain.');
  }
  const target = deployEnvironment(environment);
  if (target === 'staging' && !brand.stagingSite) throw new Error(`${brand.name} has no staging site configured.`);
  const site = target === 'staging' ? /** @type {string} */ (brand.stagingSite) : brand.site;
  return { ...brand, site, productionSite: brand.site, environment: target, contentDirectory: brand.contentDirectory };
}
