import type {StructureResolver} from 'sanity/structure'
import {CaseIcon} from '@sanity/icons/Case'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {ImageIcon} from '@sanity/icons/Image'
import {UsersIcon} from '@sanity/icons/Users'

const SPONSOR_TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Blue', 'Red'] as const

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sword & Shield')
    .items([
      S.listItem()
        .title('Home page')
        .icon(HomeIcon)
        .id('homePage')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .title('Home page'),
        ),

      S.listItem()
        .title('Life photos')
        .icon(ImageIcon)
        .id('lifeGallery')
        .child(
          S.document()
            .schemaType('lifeGallery')
            .documentId('lifeGallery')
            .title('Life photos'),
        ),

      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings'),
        ),

      S.divider(),

      S.listItem()
        .title('Sponsors')
        .icon(UsersIcon)
        .child(
          S.list()
            .title('Sponsors')
            .items([
              S.listItem()
                .title('All sponsors')
                .icon(CaseIcon)
                .child(
                  S.documentTypeList('sponsor')
                    .title('All sponsors')
                    .defaultOrdering([
                      {field: 'tier', direction: 'asc'},
                      {field: 'order', direction: 'asc'},
                      {field: 'name', direction: 'asc'},
                    ]),
                ),
              S.divider(),
              ...SPONSOR_TIERS.map((tier) =>
                S.listItem()
                  .title(`${tier} sponsors`)
                  .icon(CaseIcon)
                  .child(
                    S.documentList()
                      .title(`${tier} sponsors`)
                      .filter('_type == "sponsor" && tier == $tier')
                      .params({tier})
                      .defaultOrdering([
                        {field: 'order', direction: 'asc'},
                        {field: 'name', direction: 'asc'},
                      ])
                      .initialValueTemplates([
                        S.initialValueTemplateItem('sponsor-by-tier', {tier}),
                      ]),
                  ),
              ),
            ]),
        ),
    ])
