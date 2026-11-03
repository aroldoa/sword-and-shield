# Sword & Shield

Landing page for Cornerstone Christian Schools' Sword & Shield program. Built with [Astro](https://astro.build) and Tailwind CSS v4, deployed to Vercel.

The page is prerendered to static HTML. The only server code is `POST /api/submit-lead`, which saves form leads to Neon Postgres. It runs as a Vercel function.

## Develop

```sh
npm install
cp .env.example .env   # add your Neon pooled connection string
npm run dev            # http://localhost:4321
```

`npm run check` runs the type checker. `npm run build` produces `.vercel/output`.

## Where things live

| What | Where |
| --- | --- |
| All copy, prices, sponsors, FAQs, links | `src/data/site.ts` |
| Page sections | `src/components/*.astro` |
| Layout and meta tags | `src/layouts/Base.astro` |
| Theme colours and fonts | `src/styles/global.css` (`@theme`) |
| Lead endpoint and validation | `src/pages/api/submit-lead.ts`, `src/lib/lead.ts` |
| Database table | `schema.sql` (run once in the Neon SQL Editor) |

## Leads

The form posts to `/api/submit-lead`. The server validates the lead again: it checks the phone is a real US number (stored as E.164) and that the email's domain accepts mail. It then sends the lead to both of these:

- **HubSpot**, as a submission of the Sword & Shield form (Forms API v3). This needs `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID` and `HUBSPOT_ACCESS_TOKEN`; `.env.example` says where to find each one.
- **Neon**, as a backup copy. This needs `DATABASE_URL`.

A lead counts as received if either one succeeds. Failures are logged in the Vercel function logs.

**Database:** for a new database, run `schema.sql`. If the leads table already exists, run `migrations/001_split_name.sql` before deploying the first/last name form.

## Deploy

On Vercel, set the environment variables above for the project. Vercel detects Astro automatically, and the build runs `npm run build`.
