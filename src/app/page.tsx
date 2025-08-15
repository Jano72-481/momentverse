'use client'

import Hero from '@/components/Hero';
import DailyHighlight from '@/components/DailyHighlight';
import TimelinePreview from '@/components/TimelinePreview';
import Tiers from '@/components/Tiers';
import WhyChoose from '@/components/WhyChoose';
import Testimonials from '@/components/Testimonials';
import StarField from '@/components/StarField';

export default function Home() {
  return (
    <div className="night-sky-bg min-h-screen">
      {/* Hero Section - Full gradient + starfield with stats */}
      <Hero />
      
      {/* Daily Highlight - Smooth transition */}
      <section className="night-sky-solid section-padding section-transition">
        <DailyHighlight />
      </section>
      
      {/* Timeline Preview - Smooth transition */}
      <section className="night-sky-solid section-padding section-transition">
        <TimelinePreview />
      </section>
      
      {/* Pricing Tiers - Alternate background with smooth transition */}
      <section className="night-sky-alt section-padding section-transition">
        <Tiers />
      </section>
      
      {/* Why Choose - Smooth transition */}
      <section className="night-sky-solid section-padding section-transition">
        <WhyChoose />
      </section>
      
      {/* Testimonials - Full gradient + starfield with smooth transition */}
      <section className="night-sky-bg section-padding section-transition relative overflow-hidden">
        <StarField />
        <div className="relative z-10">
          <Testimonials />
        </div>
      </section>
    </div>
  );
} 