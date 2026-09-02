'use client';

import React, { useState, FormEvent } from 'react';

interface WaitlistSectionProps {
  onSuccess: (info: { email: string }) => void;
}

export const WaitlistSection: React.FC<WaitlistSectionProps> = ({ onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRoleClick = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
  };

  const handleSourceClick = (source: string) => {
    setSelectedSource(selectedSource === source ? null : source);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      firstName: firstName.trim(),
      email: email.trim(),
      role: selectedRole,
      source: selectedSource || (typeof window !== 'undefined' && document.referrer ? 'Web' : 'Direct'),
      timestamp: new Date().toISOString(),
    };

    try {
      if (demoMode) {
        // Simulated success
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsSubmitted(true);
        onSuccess({ email: email.trim() });
      } else {
        const res = await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          setIsSubmitted(true);
          onSuccess({ email: email.trim() });
        } else {
          setErrorMsg(data.error || 'Submission failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setErrorMsg('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="waitlist" id="waitlist">
      <div className="wrap center">
        <p className="eyebrow reveal in">Pre-launch</p>
        <h2 className="display-l reveal in" style={{ marginTop: '16px' }}>
          Join the Waitlist
        </h2>
        <p className="lead reveal in" style={{ marginTop: '14px' }}>
          Be among the first to experience Hevn.
        </p>

        <div className="waitlist-box reveal in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
              />
              <span>Demo mode (no emails)</span>
            </label>
            <div style={{ fontSize: '12px', color: 'rgba(34,30,40,0.55)' }}>Turn on for quick demos</div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} id="waitlistForm">
              {errorMsg && (
                <div style={{ color: '#ff1840', fontSize: '14px', marginBottom: '14px' }}>
                  {errorMsg}
                </div>
              )}
              <div id="formView">
                <div className="field-row field-two">
                  <div>
                    <label className="field-label">First name</label>
                    <input
                      className="field"
                      type="text"
                      name="firstName"
                      placeholder="Optional"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="field-label">Your email</label>
                    <input
                      className="field"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-row">
                  <label className="field-label">Role (optional)</label>
                  <div className="role-pills">
                    {['Student', 'Executive Assistant', 'Professional'].map((role) => (
                      <div
                        key={role}
                        className={`role-pill ${selectedRole === role ? 'sel' : ''}`}
                        onClick={() => handleRoleClick(role)}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="field-row">
                  <label className="field-label">How did you hear about us? (optional)</label>
                  <div className="role-pills">
                    {['LinkedIn', 'Twitter / X', 'ProductHunt', 'Referral', 'Search Engine', 'Other'].map((src) => (
                      <div
                        key={src}
                        className={`role-pill ${selectedSource === src ? 'sel' : ''}`}
                        onClick={() => handleSourceClick(src)}
                      >
                        {src}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : <>Join the Waitlist <span className="btn-arrow">→</span></>}
                </button>
                <p className="form-note">
                  No spam. Just one email, when Hevn is ready for you.
                </p>
              </div>
            </form>
          ) : (
            <div className="confirm show" id="confirmView">
              <div className="confirm-mark">✓</div>
              <h3 className="display-m" style={{ fontSize: '24px' }}>
                You're on the list.
              </h3>
              <p className="body-copy" style={{ marginTop: '10px' }}>
                We'll let you know when Hevn is ready for you.
              </p>
              <button
                type="button"
                className="link-underline"
                style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: '20px' }}
                onClick={() => onSuccess({ email })}
              >
                Share with friends →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
