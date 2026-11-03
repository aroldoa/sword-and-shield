import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {schemaTemplates} from './schemaTypes/templates'
import {structure} from './structure'
import {resolve} from './lib/resolve'

const isDev = process.env.MODE === 'development' || process.env.NODE_ENV === 'development'

export default defineConfig({
  name: 'default',
  title: 'Sword & Shield',

  projectId: 'euqufp3t',
  dataset: 'production',

  document: {
    singletons: [
      defineSingleton({documentId: 'homePage', schemaType: 'homePage'}),
      defineSingleton({documentId: 'lifeGallery', schemaType: 'lifeGallery'}),
      defineSingleton({documentId: 'siteSettings', schemaType: 'siteSettings'}),
    ],
  },

  plugins: [
    structureTool({
      structure,
      title: 'Edit content',
    }),
    presentationTool({
      title: 'Preview site',
      resolve,
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    // GROQ playground — keep local/dev only so editors aren’t distracted
    ...(isDev ? [visionTool({title: 'Vision (dev)'})] : []),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev.filter(
        (t) =>
          t.schemaType !== 'homePage' &&
          t.schemaType !== 'siteSettings' &&
          t.schemaType !== 'lifeGallery' &&
          t.schemaType !== 'lifePhoto',
      ),
      ...schemaTemplates,
    ],
  },
})
