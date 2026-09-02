import { NextRequest, NextResponse } from 'next/server';
import { getWaitlistEntries } from '@/lib/services/waitlist.service';

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
    const headers = ['ID', 'Name', 'Email', 'Role (Work Details)', 'Source', 'Status', 'Signed Up Date'];
    
    const csvRows = [
      headers.join(','),
      ...entries.map((item) =>
        [
          `"${item.id}"`,
          `"${(item.name || '—').replace(/"/g, '""')}"`,
          `"${item.email.replace(/"/g, '""')}"`,
          `"${(item.role || 'Unspecified').replace(/"/g, '""')}"`,
          `"${(item.source || 'Direct').replace(/"/g, '""')}"`,
          `"${item.status}"`,
          `"${item.createdAt}"`,
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="hevn_waitlist_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error('CSV Export Error:', err);
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 });
  }
}
