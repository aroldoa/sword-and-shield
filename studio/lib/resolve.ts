import {defineLocations} from 'sanity/presentation'
import type {PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    homePage: defineLocations({
      select: {title: 'title'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Home', href: '/'}],
      }),
    }),
    siteSettings: defineLocations({
      select: {title: 'title'},
      resolve: (doc) => ({
        locations: [{title: doc?.title || 'Site Settings', href: '/'}],
      }),
    }),
    sponsor: defineLocations({
      select: {title: 'name'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Sponsor', href: '/#sponsors'},
          {title: 'Home', href: '/'},
        ],
      }),
    }),
  },
}
