import sgMail from '@sendgrid/mail';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize SendGrid API key if present
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Optional Supabase client initialization
let supabase: SupabaseClient | null = null;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (process.env.SUPABASE_URL && supabaseKey) {
  try {
    supabase = createClient(
      process.env.SUPABASE_URL,
      supabaseKey
    );
  } catch (e) {
    console.warn('Supabase client initialization failed:', e instanceof Error ? e.message : e);
  }
}

export interface WaitlistPayload {
  firstName?: string;
  name?: string;
  email: string;
  role?: string | null;
  source?: string | null;
}

export interface WaitlistResult {
  ok: boolean;
  error?: string;
  details?: string;
}

export async function processWaitlistSignup(payload: WaitlistPayload): Promise<WaitlistResult> {
  const { email } = payload;
  const name = payload.name || payload.firstName || null;
  const role = payload.role || null;
  const source = payload.source || null;

  if (!email) {
    return { ok: false, error: 'Missing email address' };
  }

  // 1. Database Persistence via Supabase (if configured)
  if (supabase) {
    const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
    try {
      const dbPayload = {
        email: String(email).toLowerCase(),
        name: name || null,
        role: role || null,
        source: source || null,
      };

      const { error: dbErr } = await supabase
        .from(supabaseTable)
        .upsert([dbPayload], { onConflict: 'email' })
        .select();

      if (dbErr) {
        console.error('Supabase waitlist upsert error:', dbErr);
      }
    } catch (e) {
      console.error('Supabase unexpected error:', e);
    }
  }

  // 2. Email Notification via SendGrid
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY missing - skipping email delivery');
    return { ok: true };
  }

  const from = process.env.SENDGRID_FROM || 'noreply@hevn.example';
  const to = process.env.WAITLIST_TO || process.env.SENDGRID_FROM || from;
  const subject = `Hevn waitlist signup: ${email}`;
  const html = `
    <p><strong>Name:</strong> ${name || '—'}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Role:</strong> ${role || '—'}</p>
    <p><strong>Source:</strong> ${source || '—'}</p>
  `;

  try {
    // Send team notification
    await sgMail.send({
      to,
      from,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, '\n'),
    });

    // Send confirmation to user
    try {
      const userSubject = 'You joined the Hevn waitlist';
      const userHtml = `<p>Hi ${name || ''},</p><p>Thanks — we've added <strong>${email}</strong> to the Hevn waitlist. We'll notify you when Hevn goes live.</p><p>— The Hevn team</p>`;
      await sgMail.send({
        to: email,
        from,
        subject: userSubject,
        html: userHtml,
        text: userHtml.replace(/<[^>]+>/g, '\n'),
      });
    } catch (uErr) {
      console.error('Failed to send confirmation email to user:', uErr);
    }

    return { ok: true };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('SendGrid email delivery error:', err);
    return { ok: false, error: 'Failed to send notification email', details: errorMsg };
  }
}
