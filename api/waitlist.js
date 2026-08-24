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
    // dependency may not be installed in some environments; we'll continue without DB
    console.warn('Supabase client not available', e && e.message);
}

module.exports = async (req, res) => {
    try {
        // CORS headers for browser testing
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }

        if (!process.env.SENDGRID_API_KEY) {
            console.error('SendGrid API key missing');
            res.status(500).json({ error: 'SendGrid API key missing or not configured' });
            return;
        }
        if (req.method !== 'POST') {
            console.error('Invalid method', req.method);
            res.status(405).json({ error: `Method not allowed: ${req.method}`, allowed: ['POST'] });
            return;
        }

        const { name, email, role, source } = req.body || {};
        if (!email) {
            res.status(400).json({ error: 'Missing email' });
            return;
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

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error('waitlist send error', err);
        res.status(500).json({ error: 'Failed to send', details: err.message || String(err) });
    }
};
