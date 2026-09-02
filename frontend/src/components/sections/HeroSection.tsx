'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  onJoinClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onJoinClick }) => {
  const heroRef = useRef<HTMLElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Parallax mouse move effect
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      heroEl.style.setProperty('--hero-x', `${x}%`);
      heroEl.style.setProperty('--hero-y', `${y}%`);
    };

    const handleMouseLeave = () => {
      heroEl.style.setProperty('--hero-x', '50%');
      heroEl.style.setProperty('--hero-y', '50%');
    };

    heroEl.addEventListener('mousemove', handleMouseMove);
    heroEl.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroEl.removeEventListener('mousemove', handleMouseMove);
      heroEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Chat bubble typing animation
  useEffect(() => {
    const chatEl = chatRef.current;
    if (!chatEl) return;

    const bubbles = Array.from(chatEl.querySelectorAll('.bubble'));
    let index = 0;
    let timerId: NodeJS.Timeout;

    bubbles.forEach((b) => b.classList.add('chat-hidden'));

    const showNext = () => {
      if (index >= bubbles.length) return;
      const bubble = bubbles[index] as HTMLElement;
      bubble.classList.remove('chat-hidden');
      bubble.style.animation = 'bubbleIn 0.55s cubic-bezier(0.16, 0.8, 0.28, 1) forwards';
      bubble.classList.add('typing');

      const contentLength = bubble.textContent?.trim().length || 0;
      const duration = Math.min(900 + contentLength * 8, 2000);

      timerId = setTimeout(() => {
        bubble.classList.remove('typing');
        bubble.style.animation = '';
        index += 1;
        timerId = setTimeout(showNext, 180);
      }, duration);
    };

    timerId = setTimeout(showNext, 300);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <section className="hero" id="product" ref={heroRef}>
      <div className="hero-bg"></div>
      <div className="wrap hero-grid">
        <div>
          <h1 className="display-xl">It’s You Against a Million Tasks.</h1>
          <p className="lead" style={{ marginTop: '18px', maxWidth: '560px' }}>
            You probably forgot a task recently.
          </p>
          <p className="lead" style={{ marginTop: '8px', maxWidth: '560px' }}>
            And chances are, you’ll forget another one soon.
          </p>
          <p className="lead" style={{ marginTop: '8px', maxWidth: '560px' }}>
            Not because you’re careless. You’re just human.
          </p>
          <p className="lead" style={{ marginTop: '12px', maxWidth: '560px', fontWeight: 700 }}>
            Hevn is the AI secretary that remembers with you.
          </p>
          <div className="hero-cta-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onJoinClick}
            >
              Join the Waitlist <span className="btn-arrow">→</span>
            </button>
            <a href="#how-it-works" className="link-underline">
              See how it works
            </a>
          </div>
        </div>

        <div className="device reveal in">
          <div className="device-head">
            <div className="device-mark">
              <Image
                className="logo-img-device"
                src="/images/logo.png"
                alt="Hevn"
                width={40}
                height={40}
              />
            </div>
            <div>
              <div className="device-name">Hevn</div>
              <div className="device-sub">AI Secretary · WhatsApp</div>
            </div>
          </div>
          <div className="device-body" id="heroChat" ref={chatRef}>
            <div className="bubble from-user">
              What do I have on today?
            </div>
            <div className="bubble from-hevn">
              Good morning. Here's what needs your attention.
            </div>
            <div className="bubble from-hevn">
              <div className="agenda-list">
                <div className="agenda-row">
                  <span>09:00</span>
                  <span className="agenda-time">Design class</span>
                </div>
                <div className="agenda-row">
                  <span>12:30</span>
                  <span className="agenda-time">Review Hevn landing page</span>
                </div>
                <div className="agenda-row">
                  <span>15:00</span>
                  <span className="agenda-time">Team meeting</span>
                </div>
                <div className="agenda-row">
                  <span>18:00</span>
                  <span className="agenda-time">Submit proposal</span>
                </div>
              </div>
              <div className="agenda-tag">4 commitments · 1 high priority</div>
            </div>
            <div className="bubble from-user">
              Anything urgent?
            </div>
            <div className="bubble from-hevn">
              You're all set.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
