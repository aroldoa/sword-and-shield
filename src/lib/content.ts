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
  type Level,
  type Stat,
} from '../data/site'
import {
  HALL_OF_FAME_VIDEO,
  LIFE_PHOTOS,
  PARTNERSHIP_PHOTOS,
  type Photo,
} from '../data/showcase'
import {SPONSOR_TIERS, type SponsorTier} from '../data/sponsors'
import {loadQuery} from '../sanity/lib/load-query'
import {SITE_CONTENT_QUERY} from '../sanity/lib/queries'

export type SiteContent = {
  headerJoinUrl: string
  ticketUrl: string
  heroVideo: string
  img: typeof IMG
  contact: typeof CONTACT
  social: typeof SOCIAL
  navLinks: typeof NAV_LINKS
  stats: Stat[]
  heroSlides: {src: string; alt: string}[]
  programs: typeof PROGRAMS
  levels: Level[]
  impact: typeof IMPACT
  corporateBenefits: string[]
  faqs: typeof FAQS
  lifePhotos: Photo[]
  partnershipPhotos: Photo[]
  hallOfFameVideo: string
  sponsorTiers: SponsorTier[]
  sponsorMailto: string
}

const localFallback = (): SiteContent => ({
  headerJoinUrl: HEADER_JOIN_URL,
  ticketUrl: TICKET_URL,
  heroVideo: HERO_VIDEO,
  img: IMG,
  contact: CONTACT,
  social: SOCIAL,
  navLinks: NAV_LINKS,
  stats: STATS,
  heroSlides: HERO_SLIDES,
  programs: PROGRAMS,
  levels: LEVELS,
  impact: IMPACT,
  corporateBenefits: CORPORATE_BENEFITS,
  faqs: FAQS,
  lifePhotos: LIFE_PHOTOS,
  partnershipPhotos: PARTNERSHIP_PHOTOS,
  hallOfFameVideo: HALL_OF_FAME_VIDEO,
  sponsorTiers: SPONSOR_TIERS,
  sponsorMailto: `mailto:${CONTACT.email}?subject=${encodeURIComponent('Sword & Shield business sponsorship')}`,
})

function groupSponsors(
  sponsors: {name: string; logoUrl: string; tier: string}[],
): SponsorTier[] {
  const order = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Blue', 'Red']
  const map = new Map<string, {name: string; logo: string}[]>()
  for (const s of sponsors) {
    const list = map.get(s.tier) ?? []
    list.push({name: s.name, logo: s.logoUrl})
    map.set(s.tier, list)
  }
  return order
    .filter((tier) => map.has(tier))
    .map((tier) => ({tier, sponsors: map.get(tier)!}))
}

export async function loadSiteContent(
  perspectiveCookie?: string,
): Promise<SiteContent> {
  const fallback = localFallback()
  if (!import.meta.env.PUBLIC_SANITY_PROJECT_ID) return fallback

  try {
    const {data} = await loadQuery<{
      settings?: any
      home?: any
      lifePhotos?: {src?: string; alt?: string; order?: number}[]
      sponsors?: {name: string; logoUrl: string; tier: string}[]
    }>({
      query: SITE_CONTENT_QUERY,
      perspectiveCookie,
    })

    const settings = data?.settings
    const home = data?.home
    const sponsors = data?.sponsors

    if (
      !settings &&
      !home &&
      (!sponsors || sponsors.length === 0) &&
      (!data?.lifePhotos || data.lifePhotos.length === 0)
    ) {
      return fallback
    }

    const contact = {
      name: settings?.contact?.name ?? fallback.contact.name,
      title: settings?.contact?.title ?? fallback.contact.title,
      email: settings?.contact?.email ?? fallback.contact.email,
      office: settings?.contact?.office ?? fallback.contact.office,
      cell: settings?.contact?.cell ?? fallback.contact.cell,
    }

    return {
      headerJoinUrl: settings?.headerJoinUrl ?? fallback.headerJoinUrl,
      ticketUrl: settings?.ticketUrl ?? fallback.ticketUrl,
      heroVideo: settings?.heroVideoUrl ?? fallback.heroVideo,
      img: {
        ...fallback.img,
        logo: settings?.logoUrl ?? fallback.img.logo,
        shield: settings?.shieldUrl ?? fallback.img.shield,
        membershipBg: settings?.membershipBgUrl ?? fallback.img.membershipBg,
        director: settings?.contact?.photoUrl ?? fallback.img.director,
      },
      contact,
      social: {
        instagram: settings?.social?.instagram ?? fallback.social.instagram,
        facebook: settings?.social?.facebook ?? fallback.social.facebook,
        x: settings?.social?.x ?? fallback.social.x,
      },
      navLinks:
        settings?.navLinks?.length > 0
          ? settings.navLinks.map((l: {href: string; label: string}) => ({
              href: l.href,
              label: l.label,
            }))
          : fallback.navLinks,
      stats:
        home?.stats?.length > 0
          ? home.stats.map((s: Stat) => ({
              end: s.end,
              label: s.label,
              prefix: s.prefix,
              suffix: s.suffix,
            }))
          : fallback.stats,
      heroSlides:
        home?.heroSlides?.length > 0
          ? home.heroSlides.map((s: {imageUrl: string; alt?: string}) => ({
              src: s.imageUrl,
              alt: s.alt ?? '',
            }))
          : fallback.heroSlides,
      programs:
        home?.programs?.length > 0
          ? home.programs.map(
              (p: {
                title: string
                text?: string
                imageUrl?: string
                position?: string
              }) => ({
                title: p.title,
                text: p.text ?? '',
                image: p.imageUrl ?? '',
                position: p.position ?? 'center',
              }),
            )
          : fallback.programs,
      levels:
        home?.levels?.length > 0
          ? home.levels.map(
              (l: {
                name: string
                price: number
                imageUrl?: string
                alt?: string
                summary?: string
                benefits?: string[]
                featured?: boolean
                badge?: string
              }) => ({
                name: l.name,
                price: l.price,
                image: l.imageUrl ?? '',
                alt: l.alt ?? '',
                summary: l.summary ?? '',
                benefits: l.benefits ?? [],
                featured: l.featured,
                badge: l.badge,
              }),
            )
          : fallback.levels,
      impact:
        home?.impact?.length > 0
          ? home.impact.map(
              (i: {
                imageUrl?: string
                stat?: string
                title: string
                quote?: string
              }) => ({
                image: i.imageUrl ?? '',
                stat: i.stat ?? '',
                title: i.title,
                quote: i.quote ?? '',
              }),
            )
          : fallback.impact,
      corporateBenefits:
        home?.corporateBenefits?.length > 0
          ? home.corporateBenefits
          : fallback.corporateBenefits,
      faqs:
        home?.faqs?.length > 0
          ? home.faqs.map((f: {question: string; answer: string}) => ({
              q: f.question,
              a: f.answer,
            }))
          : fallback.faqs,
      lifePhotos: (() => {
        const uploaded = (data?.lifePhotos ?? [])
          .filter((p): p is {src: string; alt?: string} => Boolean(p?.src))
          .map((p) => ({src: p.src, alt: p.alt ?? ''}))
        if (uploaded.length > 0) return uploaded

        const legacy = home?.legacyLifePhotos ?? home?.lifePhotos
        if (legacy?.length > 0) {
          return legacy
            .filter((p: {imageUrl?: string}) => Boolean(p?.imageUrl))
            .map((p: {imageUrl: string; alt?: string}) => ({
              src: p.imageUrl,
              alt: p.alt ?? '',
            }))
        }
        return fallback.lifePhotos
      })(),
      partnershipPhotos:
        home?.partnershipPhotos?.length > 0
          ? home.partnershipPhotos.map((p: {imageUrl: string; alt?: string}) => ({
              src: p.imageUrl,
              alt: p.alt ?? '',
            }))
          : fallback.partnershipPhotos,
      hallOfFameVideo: home?.hallOfFameVideoUrl ?? fallback.hallOfFameVideo,
      sponsorTiers:
        sponsors && sponsors.length > 0
          ? groupSponsors(sponsors)
          : fallback.sponsorTiers,
      sponsorMailto: `mailto:${contact.email}?subject=${encodeURIComponent('Sword & Shield business sponsorship')}`,
    }
  } catch (err) {
    console.warn('[sanity] Falling back to local content:', err)
    return fallback
  }
}

/** Prefer Astro.locals.site from middleware; kept for scripts/tests. */
export function getSiteContent(perspectiveCookie?: string) {
  return loadSiteContent(perspectiveCookie)
}
