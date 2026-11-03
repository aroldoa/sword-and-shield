import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

export const lifeGallery = defineType({
  name: 'lifeGallery',
  type: 'document',
  title: 'Life photos',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Life photos',
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description:
        'Drag multiple images onto this area (or click Add item). Reorder by dragging tiles.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {
            hotspot: true,
            accept: 'image/*',
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Short description for accessibility',
            }),
          ],
        }),
      ],
      options: {
        layout: 'grid',
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Life photos',
        subtitle: 'Drag & drop many images at once',
        media: ImageIcon,
      }
    },
  },
})
