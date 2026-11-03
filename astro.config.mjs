// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_STUDIO_URL,
} = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  site: 'https://swordandshield.vercel.app', // TODO: set to the production domain
  // Server output is required for Sanity draft mode / Visual Editing cookies.
  // The homepage and API routes run as Vercel functions.
  output: 'server',
  // One page: inline the CSS so first paint needs no extra request.
  build: { inlineStylesheets: 'always' },
  adapter: vercel(),
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET || 'production',
      useCdn: false,
      apiVersion: '2025-11-03',
      stega: {
        studioUrl:
          PUBLIC_SANITY_STUDIO_URL || 'https://sword-and-shield.sanity.studio',
      },
    }),
    react(),
  ],
  env: {
    schema: {
      // Optional at build time so the static site builds without it;
      // the lead endpoint reports a config error at runtime if it's missing.
      DATABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      // HubSpot form submissions (all three required to enable HubSpot).
      HUBSPOT_PORTAL_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      HUBSPOT_FORM_GUID: envField.string({ context: 'server', access: 'secret', optional: true }),
      HUBSPOT_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Sanity CMS
      PUBLIC_SANITY_PROJECT_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_SANITY_DATASET: envField.string({ context: 'client', access: 'public', optional: true }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Viewer (or Editor) token for draft content in Presentation / Visual Editing.
      SANITY_API_READ_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        'react/compiler-runtime',
        'lodash/isObject.js',
        'lodash/groupBy.js',
        'lodash/keyBy.js',
        'lodash/partition.js',
        'lodash/sortedIndex.js',
      ],
    },
  },
});
