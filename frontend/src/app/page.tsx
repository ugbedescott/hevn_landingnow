'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { RoadmapSection } from '@/components/sections/RoadmapSection';
import { WaitlistSection } from '@/components/sections/WaitlistSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';
import { Footer } from '@/components/layout/Footer';
import { ShareModal } from '@/components/modals/ShareModal';

export default function Home() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('#waitlistForm input[name="email"]');
        if (input) input.focus();
      }, 420);
    }
  };

  const handleQuickJoin = (email: string) => {
    const input = document.querySelector<HTMLInputElement>('#waitlistForm input[name="email"]');
    if (input && email) {
      input.value = email;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    scrollToWaitlist();
  };

  return (
    <>
      <Header onJoinClick={scrollToWaitlist} />
      <main>
        <HeroSection onJoinClick={scrollToWaitlist} />
        <RoadmapSection />
        <WaitlistSection onSuccess={() => setIsShareModalOpen(true)} />
        <FinalCTASection onQuickJoin={handleQuickJoin} />
      </main>
      <Footer />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
}
