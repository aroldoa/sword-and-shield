import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'
import {urlMedia} from './preview'

const TIERS = [
  {title: 'Platinum', value: 'Platinum'},
  {title: 'Gold', value: 'Gold'},
  {title: 'Silver', value: 'Silver'},
  {title: 'Bronze', value: 'Bronze'},
  {title: 'Blue', value: 'Blue'},
  {title: 'Red', value: 'Red'},
]

export const sponsor = defineType({
  name: 'sponsor',
  type: 'document',
  title: 'Sponsor',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Sponsor name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logoUrl',
      title: 'Logo URL',
      type: 'url',
      description: 'Transparent PNG/SVG works best on the dark site background',
      validation: (rule) => rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'tier',
      title: 'Sponsorship tier',
      type: 'string',
      options: {list: TIERS, layout: 'radio'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first within the same tier',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Tier, then order',
      name: 'tierOrder',
      by: [
        {field: 'tier', direction: 'asc'},
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
    {
      title: 'Name A–Z',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'tier', media: 'logoUrl', order: 'order'},
    prepare({title, subtitle, media, order}) {
      return {
        title: title || 'Untitled sponsor',
        subtitle: [subtitle, order != null ? `#${order}` : null].filter(Boolean).join(' · '),
        media: urlMedia(media, CaseIcon),
      }
    },
  },
})
