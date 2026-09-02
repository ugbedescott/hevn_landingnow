import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Hevn',
  description: 'Understand how Hevn collects, uses, and protects your personal information and chat interactions.',
};

export default function PrivacyPage() {
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
            <span className="eyebrow">Legal & Security</span>
            <h1 className="display-l" style={{ marginTop: '12px', color: 'var(--plum)' }}>
              Privacy Policy
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
                1. Overview & Commitment
              </h2>
              <p className="body-copy">
                At Hevn (“we”, “our”, or “us”), we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how your data is collected, processed, and safeguarded when you use the Hevn AI Secretary service across WhatsApp, Telegram, and our website.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                2. Information We Collect
              </h2>
              <p className="body-copy" style={{ marginBottom: '12px' }}>
                To provide an accurate, proactive AI Secretary experience, we collect:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.7, color: 'rgba(34, 30, 40, 0.8)' }}>
                <li>
                  <strong>Waitlist Information:</strong> Your name, email address, role (e.g., Student, Executive, Professional), and referral source when joining our waitlist.
                </li>
                <li>
                  <strong>Message Interactions:</strong> Text messages, scheduling requests, and task reminders sent to Hevn inside messaging platforms (WhatsApp and Telegram).
                </li>
                <li>
                  <strong>Technical & Device Data:</strong> IP addresses, browser types, and standard access logs collected when visiting our web application.
                </li>
              </ul>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                3. How We Use Your Data
              </h2>
              <p className="body-copy" style={{ marginBottom: '12px' }}>
                Your data is processed exclusively to deliver product functionality:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.7, color: 'rgba(34, 30, 40, 0.8)' }}>
                <li>Organizing your calendar commitments, reminders, and daily agendas.</li>
                <li>Proactively sending nudges for upcoming deadlines and study schedules.</li>
                <li>Sending essential transactional emails regarding your waitlist status.</li>
                <li>Improving model responsiveness and conversation quality.</li>
              </ul>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                4. Data Protection & Zero Ad Selling
              </h2>
              <p className="body-copy">
                <strong>We never sell your data to third parties or advertisers.</strong> All messaging interactions are encrypted in transit and at rest. Access to backend databases is strictly restricted to authorized serverless execution pipelines.
              </p>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                5. Third-Party Integrations
              </h2>
              <p className="body-copy" style={{ marginBottom: '12px' }}>
                We utilize industry-trusted service providers to operate Hevn:
              </p>
              <ul style={{ paddingLeft: '24px', lineHeight: 1.7, color: 'rgba(34, 30, 40, 0.8)' }}>
                <li><strong>Supabase:</strong> Encrypted PostgreSQL database storage.</li>
                <li><strong>SendGrid:</strong> Transactional email dispatch.</li>
                <li><strong>WhatsApp & Telegram APIs:</strong> End-to-end messaging infrastructure.</li>
              </ul>
            </section>

            <hr style={{ border: 'none', height: '1px', background: 'var(--line-soft)' }} />

            <section style={{ padding: 0 }}>
              <h2 className="display-m" style={{ fontSize: '22px', marginBottom: '12px' }}>
                6. Your Rights & Data Deletion
              </h2>
              <p className="body-copy">
                You have the right to inspect, update, or request the complete erasure of your data at any time. To request data deletion or opt out of waitlist communications, contact us at <strong>privacy@hevn.example</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
