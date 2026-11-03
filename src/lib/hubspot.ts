// Sends a lead to HubSpot as a form submission (Forms API v3, authenticated endpoint).
// https://developers.hubspot.com/docs/api/marketing/forms → "Submit data to a form (authenticated)"
import type { Lead } from './lead';

export interface HubSpotConfig {
  portalId: string;
  formGuid: string;
  token: string; // private app access token with the `forms` scope
}

export interface SubmissionContext {
  pageUri?: string;
  pageName?: string;
  /** Value of the `hubspotutk` cookie, if the HubSpot tracking code is on the page. */
  hutk?: string;
  ipAddress?: string;
}

export type HubSpotResult = { ok: true } | { ok: false; status?: number; error: string };

const CONTACT = '0-1'; // HubSpot object type id for contacts

export async function submitToHubSpot(
  lead: Lead,
  config: HubSpotConfig,
  context: SubmissionContext = {},
  fetchImpl: typeof fetch = fetch,
): Promise<HubSpotResult> {
  const url = `https://api.hsforms.com/submissions/v3/integration/secure/submit/${encodeURIComponent(
    config.portalId,
  )}/${encodeURIComponent(config.formGuid)}`;

  // Property names must match fields that exist on the HubSpot form.
  const fields = [
    { objectTypeId: CONTACT, name: 'firstname', value: lead.first_name },
    { objectTypeId: CONTACT, name: 'lastname', value: lead.last_name },
    { objectTypeId: CONTACT, name: 'email', value: lead.email },
    ...(lead.phone ? [{ objectTypeId: CONTACT, name: 'phone', value: lead.phone }] : []),
  ];

  // HubSpot rejects empty context keys, so only send what we have.
  const ctx = Object.fromEntries(Object.entries(context).filter(([, v]) => v));

  try {
    const res = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.token}` },
      body: JSON.stringify({ submittedAt: Date.now(), fields, context: ctx }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return { ok: true };
    const text = await res.text().catch(() => '');
    return { ok: false, status: res.status, error: text.slice(0, 500) || res.statusText };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
