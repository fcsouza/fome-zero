'use client';

import { useEffect } from 'react';
import { LandingHeader } from '@/components/landing/header';
import { HeroSection } from '@/components/landing/hero-section';
import { FearVsSecurity } from '@/components/landing/fear-vs-security';
import { Pillars } from '@/components/landing/pillars';
import { AIFeatures } from '@/components/landing/ai-features';
import { Flow } from '@/components/landing/flow';
import { CTASection } from '@/components/landing/cta-section';
import { LandingFooter } from '@/components/landing/footer';

export default function Home() {
  useEffect(() => {
    // Smooth scroll for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href);
          if (element) {
            e.preventDefault();
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FearVsSecurity />
        <Pillars />
        <AIFeatures />
        <Flow />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
