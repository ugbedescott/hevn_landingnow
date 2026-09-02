'use client';

import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  msg?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title = "You're on the list.",
  msg = "Thanks — we added you to the waitlist. Share Hevn with friends:",
}) => {
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://hevn.app';
  const shareText = `I'm on the Hevn waitlist — check it out: ${currentUrl}`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent('Join me on Hevn')}&body=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="modal" aria-hidden="false">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        <h3 className="display-m" id="modalTitle">
          {title}
        </h3>
        <p className="body-copy" id="modalMsg" style={{ marginTop: '8px' }}>
          {msg}
        </p>
        <div className="share-row" style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <a
            href={whatsappUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a
            href={emailUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Email
          </a>
          <a
            href={twitterUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </div>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
