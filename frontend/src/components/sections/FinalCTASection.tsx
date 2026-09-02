'use client';

import React, { useState, useEffect } from 'react';

interface FinalCTASectionProps {
  onQuickJoin: (email: string) => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ onQuickJoin }) => {
  const [emailInput, setEmailInput] = useState('');
  const [countdownText, setCountdownText] = useState('— : — : — : —');

  useEffect(() => {
    // Launch Date (12 days + 4 hours + 38 mins from base)
    const LAUNCH_DATE = new Date(
      Date.now() +
        12 * 24 * 60 * 60 * 1000 +
        4 * 60 * 60 * 1000 +
        38 * 60 * 1000
    );

    const pad = (n: number) => String(n).padStart(2, '0');

    const tick = () => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdownText('Now');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setCountdownText(`${pad(days)} : ${pad(hours)} : ${pad(mins)} : ${pad(secs)}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinClick = () => {
    onQuickJoin(emailInput);
  };

  return (
    <section className="final">
      <div className="wrap">
        <h2 className="display-l">You Have Enough to Remember.</h2>
        <div className="display-xl">Let Hevn remember the rest.</div>

        <div className="final-count">
          Launching in
          <span className="count-nums" id="finalCountdown">{countdownText}</span>
        </div>

        <div className="final-waitlist">
          <label className="field-label" style={{ color: 'rgba(250, 246, 238, 0.5)' }}>
            Your email
          </label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
            <input
              id="finalEmailInput"
              className="field"
              type="email"
              placeholder="you@example.com"
              style={{ flex: 1, minWidth: '180px' }}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button
              id="finalJoinBtn"
              className="btn btn-primary"
              type="button"
              onClick={handleJoinClick}
            >
              Join <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="signature-line">That experience is Hevn.</div>
      </div>
    </section>
  );
};
