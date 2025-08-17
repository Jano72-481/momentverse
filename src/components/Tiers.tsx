'use client';
import Link from 'next/link';

export default function Tiers() {
  const tiers = [
    {
      name: 'Basic Moment',
      price: '$4.99',
      description: 'Perfect for getting started',
      features: [
        'Standard dot on the timeline',
        'Public/private visibility toggle',
        'Basic star pairing',
        'Community access'
      ],
      cta: 'Get Started',
      href: '/claim',
      popular: false
    },
    {
      name: 'Premium Moment',
      price: '$13.99',
      description: 'For those who want the full experience',
      features: [
        'Colored dot of your choice',
        'Beautiful PDF certificate',
        'Advanced star selection',
        'Priority support',
        'Exclusive features',
        'Certificate sharing'
      ],
      cta: 'Upgrade Now',
      href: '/claim?tier=premium',
      popular: true
    }
  ];

  const faqs = [
    {
      question: "Can I upgrade later?",
      answer: "Yes, you can upgrade to Premium at any time from your dashboard."
    },
    {
      question: "Is there a limit to moments?",
      answer: "No, you can dedicate as many moments as you want with both plans."
    },
    {
      question: "Are certificates shareable?",
      answer: "Premium certificates can be shared on social media and downloaded as PDF."
    },
    {
      question: "What payment methods?",
      answer: "We accept all major credit cards, PayPal, and cryptocurrency."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the perfect way to immortalize your moment. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                tier.popular
                  ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-2 border-blue-500 shadow-xl'
                  : 'bg-slate-800/50 border border-gray-700'
              } backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-gray-400 text-lg">/moment</span>
                </div>
                <p className="text-gray-400 leading-relaxed">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-300 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Link
                  href={tier.href}
                  className={`inline-block w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    tier.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105 shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate preview */}
        <div className="mb-16 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Premium Certificate Preview</h3>
            <div className="bg-white rounded-lg p-6 text-gray-800 mb-4 shadow-lg">
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2">Certificate of Moment Dedication</h4>
                <p className="text-gray-600 mb-4 leading-relaxed">This certifies that on January 15, 2024 at 14:30 UTC</p>
                <div className="border-t border-gray-300 pt-4 mb-4">
                  <p className="text-lg font-semibold">"The moment I realized my dreams were within reach"</p>
                </div>
                <p className="text-gray-600 leading-relaxed">was dedicated to eternity and paired with the star Vega</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Certificate ID: MV-2024-001</p>
                  <p>Issued by MomentVerse</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium users receive beautifully designed, shareable certificates
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{faq.question}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 