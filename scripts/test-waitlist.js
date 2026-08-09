#!/usr/bin/env node
// Simple tester for waitlist endpoints. Usage:
//   node scripts/test-waitlist.js https://your-site.vercel.app/api/waitlist
// or
//   node scripts/test-waitlist.js http://localhost:3000/api/waitlist

const url = process.argv[2] || 'http://localhost:3000/api/waitlist';
const payload = {
    name: 'Test User',
    email: 'test+node@example.com',
    role: 'Tester',
    source: 'script'
};

async function run() {
    console.log('OPTIONS ->', url);
    try {
        const opts = await fetch(url, { method: 'OPTIONS' });
        console.log('OPTIONS', opts.status, opts.statusText);
        const text = await opts.text().catch(() => null);
        console.log('OPTIONS body:', text);
    } catch (e) {
        console.error('OPTIONS failed:', e && e.message ? e.message : e);
    }

    console.log('\nPOST ->', url);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        console.log('POST', res.status, res.statusText);
        const text = await res.text().catch(() => null);
        try {
            console.log('POST body:', JSON.parse(text));
        } catch (e) {
            console.log('POST body:', text);
        }
    } catch (e) {
        console.error('POST failed:', e && e.message ? e.message : e);
    }
}

run();
