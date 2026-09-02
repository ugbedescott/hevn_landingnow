'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  onJoinClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onJoinClick }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <div className="logo">
          <Image
            src="/images/logo.png"
            alt="Hevn logo"
            width={120}
            height={36}
            style={{ height: '36px', width: 'auto' }}
            priority
          />
        </div>
        <nav className="nav-links">
          <a href="#product">Product</a>
          <a href="#how-it-works">How it works</a>
          <a href="#for-you">For you</a>
          <a href="#about">About</a>
        </nav>
        <div className="nav-cta">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onJoinClick}
          >
            Join the Waitlist <span className="btn-arrow">→</span>
          </button>
          <button
            type="button"
            className="nav-mobile-toggle"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div
          className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
          aria-hidden={!mobileOpen}
        >
          <nav className="nav-links">
            <a href="#product" onClick={() => setMobileOpen(false)}>Product</a>
            <a href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</a>
            <a href="#for-you" onClick={() => setMobileOpen(false)}>For you</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
          </nav>
          <div className="mobile-cta">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setMobileOpen(false);
                onJoinClick();
              }}
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
