-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  role text,
  source text,
  notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Ensure unique emails
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
