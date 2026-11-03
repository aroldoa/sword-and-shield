# Sword & Shield

Landing page for Cornerstone Christian Schools' Sword & Shield program. Built with [Astro](https://astro.build) and Tailwind CSS v4, deployed to Vercel, content from [Sanity](https://www.sanity.io).

The site runs as a Vercel server app so Sanity draft mode / Visual Editing can use cookies. Lead submissions still go through `POST /api/submit-lead` → HubSpot + Neon.

## Develop

```sh
npm install
cp .env.example .env   # Neon, HubSpot, Sanity tokens
npm run dev            # http://localhost:4321
npm run studio         # Studio at http://localhost:3333
```

`npm run check` runs the type checker. `npm run build` produces `.vercel/output`.

## Where things live

| What | Where |
| --- | --- |
| Hosted Studio | https://sword-and-shield.sanity.studio |
| Local Studio | `studio/` |
| Content fetch + local fallback | `src/lib/content.ts` |
| Local seed / fallback copy | `src/data/site.ts`, `showcase.ts`, `sponsors.ts` |
| GROQ + TypeGen | `src/sanity/lib/queries.ts`, `sanity.types.ts` |
| Page sections | `src/components/*.astro` |
| Layout and meta tags | `src/layouts/Base.astro` |
| Theme colours and fonts | `src/styles/global.css` (`@theme`) |
| Lead endpoint and validation | `src/pages/api/submit-lead.ts`, `src/lib/lead.ts` |
| Database table | `schema.sql` (run once in the Neon SQL Editor) |

## Sanity CMS

```sh
npm run studio          # Local Studio (Presentation → localhost:4321)
npm run schema:deploy   # After schema changes
npm run typegen         # Regenerate sanity.types.ts from schema + queries
npm run sanity:seed     # Re-push local src/data into Sanity (destructive for sponsors)
npm run studio:deploy   # Redeploy https://sword-and-shield.sanity.studio
```

Env (see `.env.example`):

- `PUBLIC_SANITY_PROJECT_ID` / `PUBLIC_SANITY_DATASET`
- `PUBLIC_SANITY_STUDIO_URL` — local Studio for click-to-edit (`http://localhost:3333`)
- `SANITY_API_TOKEN` — write token (seed / mutations; server-only)
- `SANITY_API_READ_TOKEN` — viewer/editor token for draft preview (can match write token locally)

Also set those on Vercel for production. Hosted Studio preview points at `https://swordandshield.vercel.app`.

**Visual Editing:** open Presentation in the Studio, edit Site Settings / Home Page / Sponsors, and click overlays on the live preview.

## Leads

The form posts to `/api/submit-lead`. The server validates the lead again: it checks the phone is a real US number (stored as E.164) and that the email's domain accepts mail. It then sends the lead to both of these:

- **HubSpot**, as a submission of the Sword & Shield form (Forms API v3). This needs `HUBSPOT_PORTAL_ID`, `HUBSPOT_FORM_GUID` and `HUBSPOT_ACCESS_TOKEN`; `.env.example` says where to find each one.
- **Neon**, as a backup copy. This needs `DATABASE_URL`.

A lead counts as received if either one succeeds. Failures are logged in the Vercel function logs.

**Database:** for a new database, run `schema.sql`. If the leads table already exists, run `migrations/001_split_name.sql` before deploying the first/last name form.

## Deploy

On Vercel, set the environment variables above for the project. Vercel detects Astro automatically, and the build runs `npm run build`.
