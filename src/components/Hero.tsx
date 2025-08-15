'use client';
import Link from 'next/link';
import StarField from './StarField';

export default function Hero() {
  return (
    <section className="night-sky-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Starfield overlay */}
      <StarField />
      
      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <h1 className="night-sky-h1 mb-6">
          Dedicate Your Moments to{' '}
          <span className="night-sky-gradient-text">Eternity</span>
        </h1>
        
        <p className="night-sky-body max-w-3xl mx-auto mb-12">
          Own any second in history and pair it with a real star. Create a permanent, 
          verifiable record of your most meaningful moments that transcends traditional social media.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/claim"
            className="btn-primary-night text-white font-semibold inline-flex items-center gap-2"
          >
            Claim Your Moment
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          
          <Link
            href="/timeline"
            className="btn-secondary-night text-white font-semibold inline-flex items-center gap-2"
          >
            Explore Timeline
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
        
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">10K+</span>
            </div>
            <div className="night-sky-body">Happy Users</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">50K+</span>
            </div>
            <div className="night-sky-body">Moments Dedicated</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4.9/5</span>
            </div>
            <div className="night-sky-body">Average Rating</div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">100%</span>
            </div>
            <div className="night-sky-body">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
} 