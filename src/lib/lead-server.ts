// Server-only lead checks (Node APIs + full phone metadata). Never imported by client code.
import { resolveMx, resolve4, resolve6 } from 'node:dns/promises';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import {
  type Field,
  type FieldErrors,
  type Lead,
  PHONE_REQUIRED,
  normalizeEmail,
  validateLeadFields,
} from './lead';

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/**
 * Does the email's domain accept mail? Checks MX records (falling back to A/AAAA,
 * per RFC 5321). Fails open on timeouts/resolver errors so a DNS hiccup never
 * blocks a real lead; only a definite "this domain doesn't exist / has no mail" fails.
 */
export async function domainAcceptsMail(email: string, timeoutMs = 3000): Promise<boolean> {
  const domain = email.slice(email.lastIndexOf('@') + 1);
  // ENOTFOUND = domain doesn't exist; ENODATA = exists but has no MX (try A/AAAA next).
  const definiteNo = new Set(['ENOTFOUND', 'ENODATA']);

  const lookup = async () => {
    try {
      const mx = await resolveMx(domain);
      // A "null MX" (single record with exchange ".") means the domain explicitly takes no mail.
      if (mx.length === 1 && (mx[0].exchange === '' || mx[0].exchange === '.')) return false;
      if (mx.length) return true;
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code ?? '';
      if (code === 'ENOTFOUND') return false;
      if (!definiteNo.has(code)) return true; // resolver trouble — don't punish the user
    }
    // No MX: an A/AAAA record is an implicit mail host.
    const hasAddr = await Promise.any([resolve4(domain), resolve6(domain)]).then(
      (r) => r.length > 0,
      () => false,
    );
    return hasAddr;
  };

  const timeout = new Promise<boolean>((resolve) => setTimeout(() => resolve(true), timeoutMs));
  return Promise.race([lookup(), timeout]);
}

/** Returns the E.164 number if it's a valid, assigned US number, else undefined. */
export function toE164US(raw: string): string | undefined {
  const parsed = parsePhoneNumberFromString(raw, 'US');
  if (!parsed || parsed.country !== 'US' || !parsed.isValid()) return undefined;
  return parsed.number; // e.g. +12105551234
}

export type ParseResult =
  | { ok: true; lead: Lead }
  | { ok: true; spam: true }
  | { ok: false; errors: FieldErrors };

export async function parseLeadRequest(body: unknown): Promise<ParseResult> {
  if (!body || typeof body !== 'object') return { ok: false, errors: { email: 'Invalid request' } };
  const b = body as Record<string, unknown>;

  // Honeypot — humans never see this field. Pretend success so bots don't adapt.
  if (str(b.website).trim()) return { ok: true, spam: true };

  const input: Record<Field, string> = {
    first_name: str(b.first_name),
    last_name: str(b.last_name),
    email: str(b.email),
    phone: str(b.phone),
  };

  // Same rules the browser runs…
  const errors = validateLeadFields(input);

  // …plus the checks only the server can do.
  let phone: string | null = null;
  if (!errors.phone && input.phone.trim()) {
    phone = toE164US(input.phone) ?? null;
    if (!phone) errors.phone = 'That phone number isn’t a valid US number';
  } else if (!errors.phone && PHONE_REQUIRED) {
    errors.phone = 'Phone number is required';
  }

  const email = normalizeEmail(input.email);
  if (!errors.email && !(await domainAcceptsMail(email))) {
    errors.email = `We can’t deliver email to “${email.split('@')[1]}”. Please check the address.`;
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      email,
      phone,
    },
  };
}
