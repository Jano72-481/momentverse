'use client';
import { useState, useEffect } from 'react';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      quote: "MomentVerse helped me immortalize the moment I proposed to my wife. Now it's paired with the star Vega, just like our love story.",
      name: "Michael Chen",
      role: "Software Engineer",
      avatar: "MC",
      rating: 5
    },
    {
      id: 2,
      quote: "I dedicated the moment my daughter was born. The certificate is beautiful and I can't wait to show it to her when she's older.",
      name: "Sarah Johnson",
      role: "Marketing Director",
      avatar: "SJ",
      rating: 5
    },
    {
      id: 3,
      quote: "The premium features are worth every penny. The colored dots and beautiful certificates make my moments truly special.",
      name: "David Rodriguez",
      role: "Entrepreneur",
      avatar: "DR",
      rating: 5
    },
    {
      id: 4,
      quote: "I love how I can explore the timeline and see moments from people around the world. It's like a global time capsule.",
      name: "Emma Thompson",
      role: "Teacher",
      avatar: "ET",
      rating: 5
    },
    {
      id: 5,
      quote: "The star pairing feature is incredible. I paired my graduation moment with Polaris - the North Star. Perfect symbolism.",
      name: "Alex Kim",
      role: "Graduate Student",
      avatar: "AK",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 text-lg">
            Join thousands of people who have dedicated their moments to eternity
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-2xl p-8 md:p-12 text-center">
            {testimonials[currentIndex] && (
              <>
                <div className="mb-8">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">⭐</span>
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl text-white leading-relaxed italic">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-gray-400">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-800 border border-gray-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-slate-800 border border-gray-700 rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-400">Happy Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-2">50K+</div>
            <div className="text-gray-400">Moments Dedicated</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-2">4.9/5</div>
            <div className="text-gray-400">Average Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-2">100%</div>
            <div className="text-gray-400">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
} 