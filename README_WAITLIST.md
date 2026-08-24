Waitlist serverless functions

This project includes two serverless endpoints to accept waitlist signups and send an email notification via SendGrid.

- Vercel: `api/waitlist.js` (POST JSON)
- Netlify: `netlify/functions/waitlist.js` (POST JSON)

Environment variables (see `.env.example`):

- `SENDGRID_API_KEY`
- `SENDGRID_FROM`
- `WAITLIST_TO` (optional)
- `SUPABASE_URL` (optional - required if using DB)
- `SUPABASE_SERVICE_ROLE_KEY` (server-side key - required for serverless upserts)

Create a `.env` file or set these values in your deployment provider. If
`SENDGRID_API_KEY` is missing the function will return a 500 with a message
like "SendGrid API key missing or not configured". When testing, make sure
`SENDGRID_FROM` is a verified sender in SendGrid to avoid delivery errors.

If you see a "Method not allowed" (405) response in the browser/network
tab, check the following:

- The functions accept only `POST` requests; preflight `OPTIONS` are handled
  and return 204, but ensure your client is issuing `POST` with
  `Content-Type: application/json`.
- If testing from a local file (`file://`) the requests will fail — run the
  functions via the deployment provider's dev CLI (`vercel dev` or
  `netlify dev`) or deploy to verify.
- Browser CORS is enabled (`Access-Control-Allow-Origin: *`) in the functions
  to simplify testing; if you have a stricter policy in production, adjust
  headers accordingly.

Client: `index (2).html` contains a modal and JS that POSTs the signup to `/api/waitlist` then falls back to `/.netlify/functions/waitlist` if needed.

Deploy: install dependencies and push to Vercel or Netlify. On Vercel, the `api/` folder becomes serverless functions. On Netlify, `netlify/functions/` becomes functions.

Local test (Netlify dev or Vercel dev): set env vars and use the provider's CLI to run functions locally.

Demo / simulation: for local demos without sending email, append `?simulate_success=1` to the page URL
or set `window.SIMULATE_WAITLIST = true` in the browser console. The client will then skip the
network call and show the success/Share modal so you can test the UX.

Non-technical testing (quick guide)

- Open the page in a browser (deployed URL or local dev server).
- Near the Waitlist form enable the **Demo mode (no emails)** checkbox — this prevents any real emails.
- Enter a name (optional) and an email, then click **Join the Waitlist**.
  -- You should see an inline confirmation and a **Share** modal asking if you want to share with friends.
  -- (No visible server response panel anymore.) If you need to inspect payloads, enable demo via `?simulate_success=1` or open the browser console and check network requests.

This flow is designed so non-technical testers can exercise the full UX without sending real emails or touching the console.
