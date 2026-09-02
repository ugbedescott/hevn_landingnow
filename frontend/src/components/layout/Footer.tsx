'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-panel">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: '6px' }}>
              <Image
                src="/images/logo.png"
                alt="Hevn logo"
                width={120}
                height={36}
                style={{ height: '36px', width: 'auto' }}
              />
            </div>
            <p>
              Quietly present. Always present. Hevn helps your day stay on track
              without asking you to switch apps.
            </p>
          </div>
          <div className="footer-links">
            <Link href="/#product">Product</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#about">About</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/#waitlist">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>WhatsApp · Telegram</span>
          <span>© 2026 Hevn. Built for calmer momentum.</span>
        </div>
      </div>
    </footer>
  );
};
