import sgMail from '@sendgrid/mail';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid API key if present
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Optional Supabase client initialization
let supabase: SupabaseClient | null = null;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;
if (process.env.SUPABASE_URL && supabaseKey) {
  try {
    supabase = createClient(process.env.SUPABASE_URL, supabaseKey);
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

export interface WaitlistRecord {
  id: string;
  name: string | null;
  email: string;
  role: string | null;
  source: string | null;
  status: 'pending' | 'contacted' | 'onboarded';
  createdAt: string;
}

// Path to local JSON fallback database
const DB_DIR = path.resolve(process.cwd(), '../backend/db');
const DB_FILE = path.join(DB_DIR, 'waitlist.json');

const INITIAL_SEED_DATA: WaitlistRecord[] = [
  {
    id: 'wl_seed_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    role: 'Executive Assistant',
    source: 'LinkedIn',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'wl_seed_2',
    name: 'Marcus Vance',
    email: 'marcus.vance@innovate.co',
    role: 'Professional',
    source: 'Twitter / X',
    status: 'contacted',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'wl_seed_3',
    name: 'Elena Rostova',
    email: 'elena.r@stanford.edu',
    role: 'Student',
    source: 'ProductHunt',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'wl_seed_4',
    name: 'David Miller',
    email: 'd.miller@apexventures.com',
    role: 'Professional',
    source: 'Direct Search',
    status: 'onboarded',
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'wl_seed_5',
    name: 'Amara Okafor',
    email: 'amara.okafor@horizon.org',
    role: 'Executive Assistant',
    source: 'Referral',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

function ensureDbFile(): WaitlistRecord[] {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED_DATA, null, 2), 'utf-8');
      return INITIAL_SEED_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.error('Error reading waitlist DB file:', err);
  }
  return INITIAL_SEED_DATA;
}

function saveDbFile(records: WaitlistRecord[]): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving waitlist DB file:', err);
  }
}

export async function getWaitlistEntries(): Promise<WaitlistRecord[]> {
  const localRecords = ensureDbFile();

  // If Supabase is available, fetch from Supabase table
  if (supabase) {
    const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
    try {
      const { data, error } = await supabase
        .from(supabaseTable)
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const supabaseRecords: WaitlistRecord[] = data.map((item: any) => ({
          id: item.id || item.email,
          name: item.name || null,
          email: item.email,
          role: item.role || null,
          source: item.source || null,
          status: item.status || (item.notified ? 'contacted' : 'pending'),
          createdAt: item.created_at || new Date().toISOString(),
        }));

        // Merge Supabase records into local store (deduplicating by email)
        const emailMap = new Map<string, WaitlistRecord>();
        // First insert local records
        localRecords.forEach((r) => emailMap.set(r.email.toLowerCase(), r));
        // Override / insert Supabase records
        supabaseRecords.forEach((r) => emailMap.set(r.email.toLowerCase(), r));

        const merged = Array.from(emailMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        saveDbFile(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Supabase fetch error, returning local store:', err);
    }
  }

  // Fallback to local store
  return localRecords;
}

export async function processWaitlistSignup(payload: WaitlistPayload): Promise<WaitlistResult> {
  const { email } = payload;
  const name = payload.name || payload.firstName || null;
  const role = payload.role || null;
  const source = payload.source || null;

  if (!email) {
    return { ok: false, error: 'Missing email address' };
  }

  const cleanEmail = String(email).toLowerCase().trim();

  // 1. Database Persistence via Supabase (if configured)
  if (supabase) {
    const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
    try {
      const dbPayload = {
        email: cleanEmail,
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

  // 2. Always persist locally as well so local admin dashboard captures it instantly
  const localRecords = ensureDbFile();
  const existingIdx = localRecords.findIndex((r) => r.email.toLowerCase() === cleanEmail);
  const newRecord: WaitlistRecord = {
    id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: name || null,
    email: cleanEmail,
    role: role || null,
    source: source || 'direct',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    localRecords[existingIdx] = {
      ...localRecords[existingIdx],
      name: name || localRecords[existingIdx].name,
      role: role || localRecords[existingIdx].role,
      source: source || localRecords[existingIdx].source,
    };
  } else {
    localRecords.unshift(newRecord);
  }
  saveDbFile(localRecords);

  // 3. Email Notification via SendGrid (if key configured)
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY missing - skipping email delivery');
    return { ok: true };
  }

  const from = process.env.SENDGRID_FROM || 'noreply@hevn.example';
  const to = process.env.WAITLIST_TO || process.env.SENDGRID_FROM || from;
  const subject = `Hevn waitlist signup: ${cleanEmail}`;
  const html = `
    <p><strong>Name:</strong> ${name || '—'}</p>
    <p><strong>Email:</strong> ${cleanEmail}</p>
    <p><strong>Role:</strong> ${role || '—'}</p>
    <p><strong>Source:</strong> ${source || '—'}</p>
  `;

  try {
    await sgMail.send({
      to,
      from,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, '\n'),
    });

    try {
      const userSubject = 'You joined the Hevn waitlist';
      const userHtml = `<p>Hi ${name || ''},</p><p>Thanks — we've added <strong>${cleanEmail}</strong> to the Hevn waitlist. We'll notify you when Hevn goes live.</p><p>— The Hevn team</p>`;
      await sgMail.send({
        to: cleanEmail,
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

export async function addWaitlistEntry(payload: {
  name?: string;
  email: string;
  role?: string;
  source?: string;
}): Promise<WaitlistRecord> {
  const records = ensureDbFile();
  const cleanEmail = payload.email.toLowerCase().trim();
  const record: WaitlistRecord = {
    id: `wl_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    name: payload.name?.trim() || null,
    email: cleanEmail,
    role: payload.role?.trim() || null,
    source: payload.source?.trim() || 'Manual Admin Entry',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const existingIdx = records.findIndex((r) => r.email.toLowerCase() === cleanEmail);
  if (existingIdx >= 0) {
    records[existingIdx] = { ...records[existingIdx], ...record };
  } else {
    records.unshift(record);
  }
  saveDbFile(records);

  if (supabase) {
    const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
    try {
      await supabase.from(supabaseTable).upsert([
        {
          email: cleanEmail,
          name: record.name,
          role: record.role,
          source: record.source,
        },
      ]);
    } catch (err) {
      console.warn('Supabase manual insert error:', err);
    }
  }

  return record;
}

export async function updateWaitlistEntryStatus(
  idOrEmail: string,
  status: 'pending' | 'contacted' | 'onboarded'
): Promise<boolean> {
  const records = ensureDbFile();
  const idx = records.findIndex((r) => r.id === idOrEmail || r.email.toLowerCase() === idOrEmail.toLowerCase());
  if (idx >= 0) {
    records[idx].status = status;
    saveDbFile(records);

    if (supabase) {
      const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
      try {
        await supabase
          .from(supabaseTable)
          .update({ status, notified: status !== 'pending' })
          .eq('email', records[idx].email);
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }
    return true;
  }
  return false;
}

export async function deleteWaitlistEntry(idOrEmail: string): Promise<boolean> {
  const records = ensureDbFile();
  const target = records.find((r) => r.id === idOrEmail || r.email.toLowerCase() === idOrEmail.toLowerCase());
  if (!target) return false;

  const filtered = records.filter((r) => r.id !== target.id && r.email !== target.email);
  saveDbFile(filtered);

  if (supabase) {
    const supabaseTable = process.env.SUPABASE_TABLE_NAME || 'waitlist';
    try {
      await supabase.from(supabaseTable).delete().eq('email', target.email);
    } catch (err) {
      console.warn('Supabase delete error:', err);
    }
  }
  return true;
}

