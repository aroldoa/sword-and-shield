// Lead validation shared by the browser form and the API endpoint.
// No Node or heavy imports here — this ships to the client.

export interface Lead {
  first_name: string;
  last_name: string;
  email: string;
  /** E.164 (e.g. +12105551234) once validated on the server; null if not given. */
  phone: string | null;
}

export type Field = 'first_name' | 'last_name' | 'email' | 'phone';
export type FieldErrors = Partial<Record<Field, string>>;

export const LIMITS = { name: 100, email: 254 } as const;

// ── Names ────────────────────────────────────────────────────
// Letters from any language plus the punctuation real names use: O'Brien, Mary-Jane, St. John, José.
const NAME_RE = /^\p{L}[\p{L}\p{M}'’ .-]*$/u;

export function validateName(value: string, label: string): string | undefined {
  const v = value.trim();
  if (!v) return `${label} is required`;
  if (v.length > LIMITS.name) return `${label} is too long`;
  if (!NAME_RE.test(v)) return `${label} can only contain letters, spaces, hyphens and apostrophes`;
}

// ── Email ────────────────────────────────────────────────────
// Practical syntax check: local@domain.tld, no spaces, no consecutive dots,
// domain labels of letters/digits/hyphens, TLD of 2+ letters.
const EMAIL_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export const normalizeEmail = (v: string) => v.trim().toLowerCase();

export function validateEmailSyntax(value: string): string | undefined {
  const v = normalizeEmail(value);
  if (!v) return 'Email is required';
  if (v.length > LIMITS.email || !EMAIL_RE.test(v)) return 'Please enter a valid email address';
  const typo = suggestEmail(v);
  if (typo) return `Did you mean ${typo}?`;
}

// Common misspellings of popular providers → correct domain.
const DOMAIN_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
  'gmail.cmo': 'gmail.com', 'gmail.om': 'gmail.com', 'gmailcom': 'gmail.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.co': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com', 'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com', 'icloud.con': 'icloud.com',
  'aol.co': 'aol.com', 'aol.con': 'aol.com',
};

export function suggestEmail(email: string): string | undefined {
  const at = email.lastIndexOf('@');
  if (at < 1) return;
  const fix = DOMAIN_TYPOS[email.slice(at + 1)];
  return fix ? `${email.slice(0, at)}@${fix}` : undefined;
}

// ── Phone (US / NANP) ────────────────────────────────────────
export const phoneDigits = (v: string) => {
  const d = v.replace(/\D/g, '');
  return d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
};

/** Formats progressively as the user types: (210) 555-1234 */
export function formatPhone(v: string): string {
  const d = phoneDigits(v).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * Structural NANP check (fast, client-side). The server additionally checks the
 * area code is actually assigned using libphonenumber.
 */
export function validatePhoneSyntax(value: string, required = true): string | undefined {
  if (!value.trim()) return required ? 'Phone number is required' : undefined;
  const d = phoneDigits(value);
  const invalid = 'Please enter a valid 10-digit US phone number';
  if (d.length !== 10) return invalid;
  const area = d.slice(0, 3);
  const exchange = d.slice(3, 6);
  if (!/^[2-9]/.test(area) || !/^[2-9]/.test(exchange)) return invalid;   // can't start with 0 or 1
  if (/^.11$/.test(area) || /^.11$/.test(exchange)) return invalid;       // 211, 911, … are service codes
  if (exchange === '555' && /^01\d\d$/.test(d.slice(6))) return invalid;  // 555-01XX is reserved for fiction
  if (/^(\d)\1{9}$/.test(d)) return invalid;                               // 2222222222 etc.
}

// ── Whole form ───────────────────────────────────────────────
export const PHONE_REQUIRED = true;

export function validateLeadFields(input: Record<Field, string>): FieldErrors {
  const errors: FieldErrors = {};
  const set = (f: Field, msg: string | undefined) => { if (msg) errors[f] = msg; };
  set('first_name', validateName(input.first_name, 'First name'));
  set('last_name', validateName(input.last_name, 'Last name'));
  set('email', validateEmailSyntax(input.email));
  set('phone', validatePhoneSyntax(input.phone, PHONE_REQUIRED));
  return errors;
}
