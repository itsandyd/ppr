'use client';

import Header from '@/components/coaching/landing/Header';
import HeroSection from '@/components/coaching/landing/HeroSection';
import ProblemSection from '@/components/coaching/landing/ProblemSection';
import BenefitsSection from '@/components/coaching/landing/BenefitsSection';
import ExpertsSection from '@/components/coaching/landing/ExpertsSection';
import CtaSection from '@/components/coaching/landing/CtaSection';
import DiscordSection from '@/components/coaching/landing/DiscordSection';
import Footer from '@/components/coaching/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProblemSection />
        <BenefitsSection />
        <ExpertsSection />
        <CtaSection />
        <DiscordSection />
      </main>
      <Footer />
    </div>
  );
}