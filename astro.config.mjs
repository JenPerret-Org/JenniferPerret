// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { getBrand } from './src/lib/brand-config.mjs';

// https://astro.build/config
export default defineConfig({
  site: getBrand().site,
  vite: {
    plugins: [tailwindcss()]
  }
});
