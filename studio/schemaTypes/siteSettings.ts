import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {urlMedia} from './preview'

export const siteSettings = defineType({
  name: 'siteSettings',
  type: 'document',
  title: 'Site settings',
  icon: CogIcon,
  groups: [
    {name: 'brand', title: 'Brand & media', default: true},
    {name: 'links', title: 'Buttons & nav'},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social'},
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      group: 'brand',
      description: 'Internal label in Studio',
      initialValue: 'Sword & Shield',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logoUrl',
      title: 'Logo image URL',
      type: 'url',
      group: 'brand',
      description: 'Header / footer logo (ImageKit or CMS URL)',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'shieldUrl',
      title: 'Favicon / shield URL',
      type: 'url',
      group: 'brand',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'membershipBgUrl',
      title: 'Membership section background URL',
      type: 'url',
      group: 'brand',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero video URL',
      type: 'url',
      group: 'brand',
      description: 'Background video on the hero (mp4)',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'headerJoinUrl',
      title: 'Header “Join” button URL',
      type: 'url',
      group: 'links',
      description: 'Top-nav Join Sword & Shield link',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'ticketUrl',
      title: 'Membership / ticket URL',
      type: 'url',
      group: 'links',
      description: 'Primary CTA for buying a membership',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation links',
      type: 'array',
      group: 'links',
      description: 'Desktop / mobile menu anchors',
      of: [defineArrayMember({type: 'navLink'})],
    }),
    defineField({
      name: 'contact',
      title: 'Director / contact',
      type: 'contactPerson',
      group: 'contact',
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'socialLinks',
      group: 'social',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'logoUrl'},
    prepare({title, media}) {
      return {
        title: title || 'Site settings',
        subtitle: 'Brand, contact, buttons',
        media: urlMedia(media, CogIcon),
      }
    },
  },
})
