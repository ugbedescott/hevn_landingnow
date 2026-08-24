const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Optional: Supabase client for persistent waitlist storage
let supabase = null;
try {
    const { createClient } = require('@supabase/supabase-js');
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    }
} catch (e) {
    console.warn('Supabase client not available', e && e.message);
}

exports.handler = async (event, context) => {
    try {
        const CORS_HEADERS = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 204, headers: CORS_HEADERS, body: '' };
        }

        if (!process.env.SENDGRID_API_KEY) {
            console.error('SendGrid API key missing');
            return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'SendGrid API key missing or not configured' }) };
        }

        if (event.httpMethod !== 'POST') {
            console.error('Invalid method', event.httpMethod);
            return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: `Method not allowed: ${event.httpMethod}`, allowed: ['POST'] }) };
        }

        const data = JSON.parse(event.body || '{}');
        const { name, email, role, source } = data || {};
        if (!email) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing email' }) };
        }

        // persist to Supabase waitlist (if configured)
        if (supabase) {
            try {
                const payload = { email: String(email).toLowerCase(), name: name || null, role: role || null, source: source || null };
                const { data: dbData, error: dbErr } = await supabase
                    .from('waitlist')
                    .upsert([payload], { onConflict: 'email' })
                    .select();
                if (dbErr) console.error('supabase upsert error', dbErr);
            } catch (e) {
                console.error('supabase error', e);
            }
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

        // send notification to team
        await sgMail.send({ to, from, subject, html, text: html.replace(/<[^>]+>/g, '\n') });

        // send confirmation to user
        try {
            const userFrom = from;
            const userTo = email;
            const userSubject = 'You joined the Hevn waitlist';
            const userHtml = `<p>Hi ${name || ''},</p><p>Thanks — we've added <strong>${email}</strong> to the Hevn waitlist. We'll notify you when Hevn goes live.</p><p>— The Hevn team</p>`;
            await sgMail.send({ to: userTo, from: userFrom, subject: userSubject, html: userHtml, text: userHtml.replace(/<[^>]+>/g, '\n') });
        } catch (uErr) {
            console.error('failed to send confirmation to user', uErr);
        }

        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
        console.error('netlify waitlist error', err);
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to send', details: err.message || String(err) }) };
    }
};
