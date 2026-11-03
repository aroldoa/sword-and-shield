/**
 * Fold existing lifePhoto documents into the lifeGallery singleton (image array).
 * Usage: npx tsx --env-file=.env scripts/migrate-life-gallery.ts
 */
import {createClient, type SanityClient} from '@sanity/client'
import {randomKey} from '@sanity/util/content'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-03',
  token,
  useCdn: false,
})

type LifePhotoDoc = {
  _id: string
  alt?: string
  image?: {asset?: {_ref?: string}}
}

async function main() {
  const gallery = await client.fetch<{photos?: unknown[]} | null>(
    `*[_id == "lifeGallery"][0]{ photos }`,
  )
  if (gallery?.photos && gallery.photos.length > 0) {
    console.log(`lifeGallery already has ${gallery.photos.length} photos — skipping.`)
    return
  }

  const docs = await client.fetch<LifePhotoDoc[]>(
    `*[_type == "lifePhoto" && defined(image.asset._ref)] | order(order asc, _createdAt desc){
      _id, alt, image
    }`,
  )

  if (!docs.length) {
    console.log('No lifePhoto documents found. Creating empty lifeGallery…')
    await client.createOrReplace({
      _id: 'lifeGallery',
      _type: 'lifeGallery',
      title: 'Life photos',
      photos: [],
    })
    return
  }

  const photos = docs.map((doc) => ({
    _type: 'image' as const,
    _key: randomKey(12),
    asset: {
      _type: 'reference' as const,
      _ref: doc.image!.asset!._ref!,
    },
    alt: doc.alt || '',
  }))

  await client.createOrReplace({
    _id: 'lifeGallery',
    _type: 'lifeGallery',
    title: 'Life photos',
    photos,
  })

  console.log(`✓ lifeGallery now has ${photos.length} photos (reused existing assets).`)
  console.log('Studio → Life photos → drop more images onto the grid.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
