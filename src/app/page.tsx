import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { SocialProof } from '@/components/home/SocialProof';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Features } from '@/components/home/Features';
import { DocumentationSection } from '@/components/home/DocumentationSection';
import { Comparison } from '@/components/home/Comparison';
import { Testimonials } from '@/components/home/Testimonials';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <SocialProof />
        <HowItWorks />
        <Features />
        <DocumentationSection />
        <Comparison />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
