import type {Template} from 'sanity'

/** Pre-fill sponsor tier when creating from a tier list in Structure. */
export const schemaTemplates: Template[] = [
  {
    id: 'sponsor-by-tier',
    title: 'Sponsor',
    schemaType: 'sponsor',
    parameters: [{name: 'tier', type: 'string'}],
    value: (params: {tier?: string}) => ({
      tier: params.tier,
      order: 0,
    }),
  },
]
