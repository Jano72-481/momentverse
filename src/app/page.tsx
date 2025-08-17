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
    <div className="homepage-bg min-h-screen">
      {/* Hero Section - Full gradient + starfield with stats */}
      <Hero />
      
      {/* Daily Highlight - Seamless transition */}
      <section className="section-padding section-transition">
        <DailyHighlight />
      </section>
      
      {/* Timeline Preview - Seamless transition */}
      <section className="section-padding section-transition">
        <TimelinePreview />
      </section>
      
      {/* Pricing Tiers - Seamless transition */}
      <section className="section-padding section-transition">
        <Tiers />
      </section>
      
      {/* Why Choose - Seamless transition */}
      <section className="section-padding section-transition">
        <WhyChoose />
      </section>
      
      {/* Testimonials - Seamless transition with starfield */}
      <section className="section-padding section-transition relative overflow-hidden">
        <StarField />
        <div className="relative z-10">
          <Testimonials />
        </div>
      </section>
    </div>
  );
} 