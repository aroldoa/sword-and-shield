/**
 * Upload existing homePage.lifePhotos (external URLs) into lifePhoto documents.
 * Usage: npx tsx --env-file=.env scripts/migrate-life-photos.ts
 */
import {createClient} from '@sanity/client'
import {LIFE_PHOTOS} from '../src/data/showcase'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-03',
  token,
  useCdn: false,
})

async function main() {
  const existing = await client.fetch<number>(`count(*[_type == "lifePhoto"])`)
  if (existing > 0) {
    console.log(`Already have ${existing} lifePhoto docs — skipping migration.`)
    return
  }

  // Prefer URLs already on the home page; fall back to local seed list.
  const fromCms = await client.fetch<{imageUrl?: string; alt?: string}[]>(
    `*[_id == "homePage"][0].lifePhotos[]{ imageUrl, alt }`,
  )
  const photos =
    fromCms?.filter((p) => p.imageUrl)?.length > 0
      ? fromCms.filter((p) => p.imageUrl)
      : LIFE_PHOTOS.map((p) => ({imageUrl: p.src, alt: p.alt}))

  console.log(`Migrating ${photos.length} life photos…`)

  let order = 0
  for (const photo of photos) {
    const url = photo.imageUrl!
    process.stdout.write(`  ${order + 1}/${photos.length} ${url.slice(-40)}… `)
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const contentType = res.headers.get('content-type') || 'image/jpeg'
      const filename =
        url.split('/').pop()?.split('?')[0] || `life-${order}.jpg`

      const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType,
      })

      await client.create({
        _type: 'lifePhoto',
        alt: photo.alt || '',
        order: order++,
        image: {
          _type: 'image',
          asset: {_type: 'reference', _ref: asset._id},
        },
      })
      console.log('ok')
    } catch (err) {
      console.log('FAIL', err instanceof Error ? err.message : err)
    }
  }

  console.log('Done. New uploads: Studio → Life photos → + Create')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
