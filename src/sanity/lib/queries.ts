import {defineQuery} from 'groq'

export const SITE_CONTENT_QUERY = defineQuery(`{
  "settings": *[_id == "siteSettings"][0]{
    logoUrl, shieldUrl, headerJoinUrl, ticketUrl, heroVideoUrl, membershipBgUrl,
    contact{ name, "title": role, email, office, cell, photoUrl },
    social{ instagram, facebook, x },
    navLinks[]{ _key, label, href }
  },
  "home": *[_id == "homePage"][0]{
    heroSlides[]{ _key, imageUrl, alt },
    stats[]{ _key, end, label, prefix, suffix },
    programs[]{ _key, title, text, imageUrl, position },
    levels[]{ _key, name, price, imageUrl, alt, summary, benefits, featured, badge },
    impact[]{ _key, imageUrl, stat, title, quote },
    corporateBenefits,
    faqs[]{ _key, question, answer },
    "legacyLifePhotos": lifePhotos[]{ _key, imageUrl, alt },
    partnershipPhotos[]{ _key, imageUrl, alt },
    hallOfFameVideoUrl
  },
  "lifePhotos": coalesce(
    *[_id == "lifeGallery"][0].photos[defined(asset)]{
      _key,
      alt,
      "src": asset->url
    },
    *[_type == "lifePhoto" && defined(image.asset)] | order(order asc, _createdAt desc){
      _id,
      alt,
      "src": image.asset->url
    }
  ),
  "sponsors": *[_type == "sponsor"] | order(order asc, name asc){
    _id, name, logoUrl, tier, order
  }
}`)
