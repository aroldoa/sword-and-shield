import {defineArrayMember, defineField, defineType} from 'sanity'
import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {ImageIcon} from '@sanity/icons/Image'
import {LinkIcon} from '@sanity/icons/Link'
import {StarIcon} from '@sanity/icons/Star'
import {TagIcon} from '@sanity/icons/Tag'
import {UsersIcon} from '@sanity/icons/Users'
import {urlMedia} from './preview'

export const navLink = defineType({
  name: 'navLink',
  type: 'object',
  title: 'Nav link',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'Usually a page anchor, e.g. #membership or #faq',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
  },
})

export const contactPerson = defineType({
  name: 'contactPerson',
  type: 'object',
  title: 'Contact person',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Job title',
      type: 'string',
      description: 'e.g. Director of Sword & Shield',
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'office',
      title: 'Office phone',
      type: 'string',
    }),
    defineField({
      name: 'cell',
      title: 'Cell phone',
      type: 'string',
    }),
    defineField({
      name: 'photoUrl',
      title: 'Photo URL',
      type: 'url',
      description: 'Headshot shown in the contact section',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photoUrl'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Contact',
        subtitle,
        media: urlMedia(media, UsersIcon),
      }
    },
  },
})

export const socialLinks = defineType({
  name: 'socialLinks',
  type: 'object',
  title: 'Social links',
  fields: [
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'string',
      description: 'Full URL, or # until you have one',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'string',
      description: 'Full URL, or # until you have one',
    }),
    defineField({
      name: 'x',
      title: 'X (Twitter) URL',
      type: 'string',
      description: 'Full URL, or # until you have one',
    }),
  ],
})

export const heroSlide = defineType({
  name: 'heroSlide',
  type: 'object',
  title: 'Hero slide',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Short description for accessibility',
    }),
  ],
  preview: {
    select: {title: 'alt', media: 'imageUrl'},
    prepare({title, media}) {
      return {
        title: title || 'Hero slide',
        media: urlMedia(media, ImageIcon),
      }
    },
  },
})

export const stat = defineType({
  name: 'stat',
  type: 'object',
  title: 'Stat',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'end',
      title: 'Number',
      type: 'number',
      description: 'Target value for the animated counter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'prefix',
      type: 'string',
      description: 'Shown before the number, e.g. $',
    }),
    defineField({
      name: 'suffix',
      type: 'string',
      description: 'Shown after the number, e.g. +',
    }),
  ],
  preview: {
    select: {title: 'label', end: 'end', prefix: 'prefix', suffix: 'suffix'},
    prepare({title, end, prefix, suffix}) {
      const value = `${prefix ?? ''}${end ?? ''}${suffix ?? ''}`
      return {title: title || 'Stat', subtitle: value}
    },
  },
})

export const program = defineType({
  name: 'program',
  type: 'object',
  title: 'Program',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Short description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'position',
      title: 'Image focal point',
      type: 'string',
      description: 'CSS object-position, e.g. center 25%',
      initialValue: 'center',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'text', media: 'imageUrl'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Program',
        subtitle,
        media: urlMedia(media, TagIcon),
      }
    },
  },
})

export const membershipLevel = defineType({
  name: 'membershipLevel',
  type: 'object',
  title: 'Membership level',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Level name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'imageUrl',
      title: 'Card image URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'alt',
      title: 'Image alternative text',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 2,
      description: 'One-line benefit teaser on the card',
    }),
    defineField({
      name: 'benefits',
      title: 'Benefits list',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'featured',
      title: 'Highlight this level',
      type: 'boolean',
      description: 'Visually emphasize this card',
      initialValue: false,
    }),
    defineField({
      name: 'badge',
      title: 'Badge text',
      type: 'string',
      description: 'Optional pill on the card, e.g. Popular',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      price: 'price',
      badge: 'badge',
      media: 'imageUrl',
    },
    prepare({title, price, badge, media}) {
      const priceLabel =
        price != null ? `$${Number(price).toLocaleString('en-US')}` : undefined
      return {
        title: title || 'Level',
        subtitle: [priceLabel, badge].filter(Boolean).join(' · '),
        media: urlMedia(media, StarIcon),
      }
    },
  },
})

export const impactStory = defineType({
  name: 'impactStory',
  type: 'object',
  title: 'Impact story',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'stat',
      title: 'Stat callout',
      type: 'string',
      description: 'e.g. 4 State Titles',
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'stat', media: 'imageUrl'},
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Impact story',
        subtitle,
        media: urlMedia(media, StarIcon),
      }
    },
  },
})

export const faqItem = defineType({
  name: 'faqItem',
  type: 'object',
  title: 'FAQ',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})

export const photo = defineType({
  name: 'photo',
  type: 'object',
  title: 'Photo',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'imageUrl',
      title: 'Image URL',
      type: 'url',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the photo for accessibility',
    }),
  ],
  preview: {
    select: {title: 'alt', media: 'imageUrl'},
    prepare({title, media}) {
      return {
        title: title || 'Photo',
        media: urlMedia(media, ImageIcon),
      }
    },
  },
})
