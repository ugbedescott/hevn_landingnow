import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@hevn.app').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hevn2026admin';
const COOKIE_NAME = 'hevn_admin_token';
const MOCK_TOKEN = 'hevn_admin_auth_valid_session_2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (String(email).toLowerCase().trim() === ADMIN_EMAIL && String(password) === ADMIN_PASSWORD) {
      const response = NextResponse.json(
        {
          ok: true,
          user: {
            email: ADMIN_EMAIL,
            name: 'Hevn Administrator',
            role: 'Super Admin',
          },
        },
        { status: 200 }
      );

      // Set auth cookie
      response.cookies.set({
        name: COOKIE_NAME,
        value: MOCK_TOKEN,
        httpOnly: false, // Accessible to clientJS if needed for quick state sync
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid email or password credentials' }, { status: 401 });
  } catch (err) {
    console.error('Admin Auth Error:', err);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;

  if (token === MOCK_TOKEN) {
    return NextResponse.json(
      {
        authenticated: true,
        user: {
          email: ADMIN_EMAIL,
          name: 'Hevn Administrator',
          role: 'Super Admin',
        },
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ authenticated: false }, { status: 200 });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}
