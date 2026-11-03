/**
 * One-time seed: pushes local src/data content into Sanity.
 * Usage: npx tsx --env-file=.env scripts/seed-sanity.ts
 */
import {createClient, type SanityClient} from '@sanity/client'
import {
  CONTACT,
  CORPORATE_BENEFITS,
  FAQS,
  HEADER_JOIN_URL,
  HERO_SLIDES,
  HERO_VIDEO,
  IMG,
  IMPACT,
  LEVELS,
  NAV_LINKS,
  PROGRAMS,
  SOCIAL,
  STATS,
  TICKET_URL,
} from '../src/data/site'
import {HALL_OF_FAME_VIDEO, LIFE_PHOTOS, PARTNERSHIP_PHOTOS} from '../src/data/showcase'
import {SPONSOR_TIERS} from '../src/data/sponsors'

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

const key = () => crypto.randomUUID().slice(0, 12)

async function main() {
  console.log(`Seeding ${projectId}/${dataset}…`)

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    title: 'Sword & Shield',
    logoUrl: IMG.logo,
    shieldUrl: IMG.shield,
    headerJoinUrl: HEADER_JOIN_URL,
    ticketUrl: TICKET_URL,
    heroVideoUrl: HERO_VIDEO,
    membershipBgUrl: IMG.membershipBg,
    contact: {
      name: CONTACT.name,
      role: CONTACT.title,
      email: CONTACT.email,
      office: CONTACT.office,
      cell: CONTACT.cell,
      photoUrl: IMG.director,
    },
    social: {
      instagram: SOCIAL.instagram,
      facebook: SOCIAL.facebook,
      x: SOCIAL.x,
    },
    navLinks: NAV_LINKS.map((l) => ({_type: 'navLink', _key: key(), ...l})),
  })
  console.log('✓ siteSettings')

  await client.createOrReplace({
    _id: 'homePage',
    _type: 'homePage',
    title: 'Home',
    heroSlides: HERO_SLIDES.map((s) => ({
      _type: 'heroSlide',
      _key: key(),
      imageUrl: s.src,
      alt: s.alt,
    })),
    stats: STATS.map((s) => ({
      _type: 'stat',
      _key: key(),
      end: s.end,
      label: s.label,
      prefix: s.prefix,
      suffix: s.suffix,
    })),
    programs: PROGRAMS.map((p) => ({
      _type: 'program',
      _key: key(),
      title: p.title,
      text: p.text,
      imageUrl: p.image,
      position: p.position,
    })),
    levels: LEVELS.map((l) => ({
      _type: 'membershipLevel',
      _key: key(),
      name: l.name,
      price: l.price,
      imageUrl: l.image,
      alt: l.alt,
      summary: l.summary,
      benefits: l.benefits,
      featured: l.featured,
      badge: l.badge,
    })),
    impact: IMPACT.map((i) => ({
      _type: 'impactStory',
      _key: key(),
      imageUrl: i.image,
      stat: i.stat,
      title: i.title,
      quote: i.quote,
    })),
    corporateBenefits: CORPORATE_BENEFITS,
    faqs: FAQS.map((f) => ({
      _type: 'faqItem',
      _key: key(),
      question: f.q,
      answer: f.a,
    })),
    lifePhotos: LIFE_PHOTOS.map((p) => ({
      _type: 'photo',
      _key: key(),
      imageUrl: p.src,
      alt: p.alt,
    })),
    partnershipPhotos: PARTNERSHIP_PHOTOS.map((p) => ({
      _type: 'photo',
      _key: key(),
      imageUrl: p.src,
      alt: p.alt,
    })),
    hallOfFameVideoUrl: HALL_OF_FAME_VIDEO,
  })
  console.log('✓ homePage')

  const existing = await client.fetch<string[]>(`*[_type == "sponsor"]._id`)
  if (existing.length) {
    const tx = client.transaction()
    for (const id of existing) tx.delete(id)
    await tx.commit()
    console.log(`✓ cleared ${existing.length} existing sponsors`)
  }

  let order = 0
  const tx = client.transaction()
  for (const tier of SPONSOR_TIERS) {
    for (const s of tier.sponsors) {
      tx.create({
        _type: 'sponsor',
        name: s.name,
        logoUrl: s.logo,
        tier: tier.tier,
        order: order++,
      })
    }
  }
  await tx.commit()
  console.log(`✓ ${order} sponsors`)
  console.log('Done. Site will read from Sanity on next build/dev.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
