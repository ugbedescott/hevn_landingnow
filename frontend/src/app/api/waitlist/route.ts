import { NextRequest, NextResponse } from 'next/server';
import { processWaitlistSignup } from '@/lib/services/waitlist.service';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, firstName, name, role, source } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const result = await processWaitlistSignup({
      email,
      firstName,
      name,
      role,
      source,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || 'Waitlist processing failed', details: result.details },
        { status: 500, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200, headers: CORS_HEADERS });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Waitlist API route error:', err);
    return NextResponse.json(
      { error: 'Failed to process request', details: errorMsg },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
