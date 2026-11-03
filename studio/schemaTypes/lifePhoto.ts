import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const lifePhoto = defineType({
  name: 'lifePhoto',
  type: 'document',
  title: 'Life photo',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Drag & drop or click to upload',
      options: {
        hotspot: true,
        accept: 'image/*',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Short description for accessibility (recommended)',
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      description: 'Lower numbers appear first in the marquee',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'orderAsc',
      by: [
        {field: 'order', direction: 'asc'},
        {field: '_createdAt', direction: 'desc'},
      ],
    },
  ],
  preview: {
    select: {title: 'alt', media: 'image', order: 'order'},
    prepare({title, media, order}) {
      return {
        title: title || 'Life photo',
        subtitle: order != null ? `Order ${order}` : undefined,
        media,
      }
    },
  },
})
