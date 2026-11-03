import type { APIRoute } from 'astro';
import { DATABASE_URL, HUBSPOT_ACCESS_TOKEN, HUBSPOT_FORM_GUID, HUBSPOT_PORTAL_ID } from 'astro:env/server';
import { neon } from '@neondatabase/serverless';
import { parseLeadRequest } from '../../lib/lead-server';
import { submitToHubSpot } from '../../lib/hubspot';
import type { Lead } from '../../lib/lead';

// Runs on demand as a Vercel function; the rest of the site is static.
export const prerender = false;

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

const SUCCESS = { success: true, message: 'Thank you! We will be in touch.' };
const MAX_BODY_BYTES = 4096;

const hubspot =
  HUBSPOT_PORTAL_ID && HUBSPOT_FORM_GUID && HUBSPOT_ACCESS_TOKEN
    ? { portalId: HUBSPOT_PORTAL_ID, formGuid: HUBSPOT_FORM_GUID, token: HUBSPOT_ACCESS_TOKEN }
    : null;

async function saveToNeon(lead: Lead): Promise<void> {
  if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const sql = neon(DATABASE_URL);
  const { first_name, last_name, email, phone } = lead;
  await sql`
    INSERT INTO sword_shield_leads (first_name, last_name, full_name, email, phone)
    VALUES (${first_name}, ${last_name}, ${`${first_name} ${last_name}`}, ${email}, ${phone})
  `;
}

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  if (!DATABASE_URL && !hubspot) {
    console.error('[submit-lead] Neither DATABASE_URL nor HubSpot settings are configured');
    return json({ error: 'Server configuration error' }, 500);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'Request too large' }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const result = await parseLeadRequest(body);
  if (!result.ok) {
    // `errors` is keyed by field so the form can show each message under its input.
    return json({ error: 'Please fix the highlighted fields.', errors: result.errors }, 400);
  }
  if ('spam' in result) return json(SUCCESS, 201);

  const { lead } = result;
  const referer = request.headers.get('referer') ?? undefined;

  // Neon is the backup copy, HubSpot is the CRM. Run both; the lead counts as
  // received if at least one succeeds, and failures are logged for follow-up.
  const [db, hs] = await Promise.allSettled([
    DATABASE_URL ? saveToNeon(lead) : Promise.reject(new Error('skipped: DATABASE_URL not set')),
    hubspot
      ? submitToHubSpot(lead, hubspot, {
          pageUri: referer,
          pageName: 'Sword & Shield',
          hutk: cookies.get('hubspotutk')?.value,
          ipAddress: clientAddress,
        })
      : Promise.resolve({ ok: false as const, error: 'skipped: HubSpot not configured' }),
  ]);

  const dbOk = db.status === 'fulfilled';
  const hsOk = hs.status === 'fulfilled' && hs.value.ok;

  if (!dbOk && DATABASE_URL) {
    const msg = db.reason instanceof Error ? db.reason.message : String(db.reason);
    console.error(
      /does not exist/i.test(msg)
        ? '[submit-lead] Neon schema out of date — run migrations/001_split_name.sql.'
        : '[submit-lead] Neon insert failed:',
      msg,
    );
  }
  if (!hsOk && hubspot) {
    const detail = hs.status === 'fulfilled' && !hs.value.ok ? hs.value : { error: String((hs as PromiseRejectedResult).reason) };
    // Include the lead so it can be re-entered manually if Neon also failed.
    console.error('[submit-lead] HubSpot submission failed:', JSON.stringify(detail), dbOk ? '' : JSON.stringify(lead));
  }

  if (dbOk || hsOk) return json(SUCCESS, 201);
  return json({ error: 'Unable to save. Please try again or contact us directly.' }, 500);
};

// Any other method gets a 405 with an Allow header.
export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', Allow: 'POST' },
  });
