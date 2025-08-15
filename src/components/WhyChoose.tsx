'use client';

export default function WhyChoose() {
  const features = [
    {
      icon: '⏰',
      title: 'Time Dedication',
      description: 'Own any second in history and dedicate it to eternity with our sophisticated time-stamping system.'
    },
    {
      icon: '⭐',
      title: 'Star Pairing',
      description: 'Pair your moment with a real star from our comprehensive celestial database, creating a unique cosmic connection.'
    },
    {
      icon: '🏆',
      title: 'Premium Moments & Certificates',
      description: 'Upgrade to receive beautifully designed PDF certificates that you can share and preserve forever.'
    },
    {
      icon: '🔒',
      title: 'Security & Privacy',
      description: 'Your moments are protected with enterprise-grade security and you control your privacy settings.'
    },
    {
      icon: '🌍',
      title: 'Global Community',
      description: 'Join a worldwide community of people who believe in the power of dedicating moments to eternity.'
    },
    {
      icon: '📈',
      title: 'Growing Legacy',
      description: 'Watch your moments gain value and recognition as part of humanity\'s collective timeline.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose MomentVerse?
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Experience the most sophisticated time-dedication platform in the universe. 
            We combine cutting-edge technology with timeless human connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-gray-700 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              The Most Advanced Time-Dedication Platform
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              MomentVerse represents the convergence of blockchain technology, astronomical data, 
              and human emotion. Every moment dedicated becomes part of a permanent, 
              verifiable record that transcends traditional social media.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-gray-400 leading-relaxed">Verifiable</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
                <div className="text-gray-400 leading-relaxed">Timeless</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-gray-400 leading-relaxed">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 