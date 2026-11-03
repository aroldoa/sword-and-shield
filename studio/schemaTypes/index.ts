import {
  contactPerson,
  faqItem,
  heroSlide,
  impactStory,
  membershipLevel,
  navLink,
  photo,
  program,
  socialLinks,
  stat,
} from './objects'
import {homePage} from './homePage'
import {lifeGallery} from './lifeGallery'
import {lifePhoto} from './lifePhoto'
import {siteSettings} from './siteSettings'
import {sponsor} from './sponsor'

export const schemaTypes = [
  // Documents
  siteSettings,
  homePage,
  lifeGallery,
  lifePhoto, // legacy one-off docs; kept so existing assets stay queryable during migrate
  sponsor,
  // Objects
  navLink,
  contactPerson,
  socialLinks,
  heroSlide,
  stat,
  program,
  membershipLevel,
  impactStory,
  faqItem,
  photo,
]
