import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service — Hevn',
  description: 'Review the terms and conditions governing the use of the Hevn AI Secretary service.',
};

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sub-header Navigation */}
      <header className="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo">
            <Image
              src="/images/logo.png"
              alt="Hevn logo"
              width={120}
              height={36}
              style={{ height: '36px', width: 'auto' }}
              priority
            />
          </Link>
          <nav className="nav-links">
            <Link href="/#product">Product</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#for-you">For you</Link>
            <Link href="/#about">About</Link>
          </nav>
          <div className="nav-cta">
            <Link href="/#waitlist" className="btn btn-primary">
              Join the Waitlist <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: '60px 0 100px' }}>
        <div className="wrap" style={{ maxWidth: '840px' }}>
          <div style={{ marginBottom: '40px' }}>
            <span className="eyebrow">Terms & Governance</span>
            <h1 className="display-l" style={{ marginTop: '12px', color: 'var(--plum)' }}>
              Terms of Service
            </h1>
            <p className="lead" style={{ marginTop: '14px', color: 'rgba(34, 30, 40, 0.65)' }}>
              Last updated: September 2026
            </p>
          </div>

          <div
            style={{
              background: 'var(--white)',
              borderRadius: '16px',
              padding: '48px 40px',
              boxShadow: '0 20px 60px -30px rgba(36, 23, 51, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
          >
            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                1. Acceptance of Terms
              </h2>
              <p className="body-copy">
                By accessing or using Hevn (“Service”), including signing up for the waitlist or communicating with the Hevn AI bot via WhatsApp or Telegram, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                2. Description of Service
              </h2>
              <p className="body-copy">
                Hevn is an artificial intelligence-driven secretary service designed to assist users with schedule tracking, commitment management, and task reminders directly within instant messaging applications.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                3. Acceptable Use
              </h2>
              <p className="body-copy" style={{ marginBottom: '12px' }}>
                You agree to use Hevn only for lawful productivity and personal task management purposes. You agree not to:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.7, color: 'rgba(34, 30, 40, 0.8)' }}>
                <li>Attempt to compromise, disrupt, or reverse-engineer the bot or web server infrastructure.</li>
                <li>Submit unlawful, malicious, or abusive content to the AI Secretary.</li>
                <li>Use automated scripts to spam the waitlist or endpoint APIs.</li>
              </ul>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                4. AI Assistance Disclaimer & Limitations
              </h2>
              <p className="body-copy">
                While Hevn strives to deliver highly accurate scheduling nudges, automated AI responses are provided on an “AS IS” basis. You remain solely responsible for verifying critical calendar deadlines, legal obligations, and appointment times.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                5. Intellectual Property
              </h2>
              <p className="body-copy">
                All branding, visual assets, software code, design tokens, and logos associated with Hevn remain the exclusive property of Hevn.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                6. Contact & Questions
              </h2>
              <p className="body-copy">
                If you have any questions regarding these Terms of Service, please reach out to us at <strong>terms@hevn.example</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
