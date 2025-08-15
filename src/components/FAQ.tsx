'use client';

export default function FAQ() {
  const faqs = [
    {
      question: "Can I upgrade from Basic to Premium later?",
      answer: "Yes, absolutely! You can upgrade to Premium at any time from your dashboard. Your existing moments will be preserved and you'll gain access to all Premium features immediately."
    },
    {
      question: "Is there a limit to how many moments I can dedicate?",
      answer: "No, there's no limit! You can dedicate as many moments as you want with both Basic and Premium plans. Each moment is unique and special."
    },
    {
      question: "Are Premium certificates shareable on social media?",
      answer: "Yes! Premium certificates can be shared on all major social media platforms and downloaded as high-quality PDF files. They're designed to look beautiful both online and in print."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and cryptocurrency payments including Bitcoin and Ethereum."
    },
    {
      question: "Can I change my star pairing after dedication?",
      answer: "Yes, Premium users can change their star pairing within 30 days of dedication. Basic users can upgrade to Premium to access this feature."
    },
    {
      question: "How secure is my personal information?",
      answer: "We use enterprise-grade security with end-to-end encryption. Your personal information is never shared with third parties, and you have complete control over your privacy settings."
    },
    {
      question: "What happens if I want to delete a moment?",
      answer: "You can delete any of your moments at any time from your dashboard. Deleted moments are permanently removed from our system within 30 days."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all Premium purchases. If you're not completely satisfied, we'll refund your payment no questions asked."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about dedicating moments to eternity
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Our support team is here to help you 24/7. We're passionate about helping you 
              create meaningful moments that last forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@momentverse.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </a>
              <a
                href="/help"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 