// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://swordandshield.vercel.app', // TODO: set to the production domain
  // Pages are prerendered to static HTML; only routes that opt out
  // (`export const prerender = false`) run as Vercel functions.
  output: 'static',
  // One page: inline the CSS so first paint needs no extra request.
  build: { inlineStylesheets: 'always' },
  adapter: vercel(),
  env: {
    schema: {
      // Optional at build time so the static site builds without it;
      // the lead endpoint reports a config error at runtime if it's missing.
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // HubSpot form submissions (all three required to enable HubSpot).
      HUBSPOT_PORTAL_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      HUBSPOT_FORM_GUID: envField.string({ context: 'server', access: 'secret', optional: true }),
      HUBSPOT_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
