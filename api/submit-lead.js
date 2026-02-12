import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { full_name, email, phone } = body;
  if (!full_name || !email) {
    return new Response(
      JSON.stringify({ error: 'Full name and email are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sql = neon(databaseUrl);

  try {
    await sql`
      INSERT INTO sword_shield_leads (full_name, email, phone)
      VALUES (${full_name.trim()}, ${email.trim().toLowerCase()}, ${phone ? phone.trim() : null})
    `;
    return new Response(
      JSON.stringify({ success: true, message: 'Thank you! We will be in touch.' }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Database error:', err);
    const msg = (err && err.message) ? String(err.message) : '';
    const tableMissing = /does not exist|relation .* does not exist/i.test(msg);
    const hint = tableMissing
      ? 'Database table not set up. Run schema.sql in the Neon SQL Editor (dashboard.neon.tech).'
      : 'Unable to save. Please try again or contact us directly.';
    return new Response(
      JSON.stringify({ error: hint }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
