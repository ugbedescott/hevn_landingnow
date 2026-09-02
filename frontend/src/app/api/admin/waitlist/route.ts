import { NextRequest, NextResponse } from 'next/server';
import {
  getWaitlistEntries,
  addWaitlistEntry,
  updateWaitlistEntryStatus,
  deleteWaitlistEntry,
} from '@/lib/services/waitlist.service';

const COOKIE_NAME = 'hevn_admin_token';
const MOCK_TOKEN = 'hevn_admin_auth_valid_session_2026';

function isAuthorized(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  const headerToken = req.headers.get('x-admin-token');
  return cookieToken === MOCK_TOKEN || headerToken === MOCK_TOKEN;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
  }

  try {
    const entries = await getWaitlistEntries();
    return NextResponse.json({ ok: true, data: entries }, { status: 200 });
  } catch (err) {
    console.error('Fetch waitlist error:', err);
    return NextResponse.json({ error: 'Failed to fetch waitlist entries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, role, source } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const newRecord = await addWaitlistEntry({ name, email, role, source });
    return NextResponse.json({ ok: true, data: newRecord }, { status: 201 });
  } catch (err) {
    console.error('Add waitlist entry error:', err);
    return NextResponse.json({ error: 'Failed to add waitlist entry' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing entry id or status' }, { status: 400 });
    }

    const updated = await updateWaitlistEntryStatus(id, status);
    if (updated) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  } catch (err) {
    console.error('Update status error:', err);
    return NextResponse.json({ error: 'Failed to update entry status' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing entry id parameter' }, { status: 400 });
    }

    const deleted = await deleteWaitlistEntry(id);
    if (deleted) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  } catch (err) {
    console.error('Delete waitlist entry error:', err);
    return NextResponse.json({ error: 'Failed to delete waitlist entry' }, { status: 500 });
  }
}
