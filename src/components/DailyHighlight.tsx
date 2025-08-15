'use client';
import Link from 'next/link';

export default function DailyHighlight() {
  // Mock data - replace with real API call
  const dailyHighlight = {
    id: '1',
    dedication: "The moment I realized my dreams were within reach",
    user: "Sarah Chen",
    likes: 47,
    timestamp: "2024-01-15T14:30:00Z",
    star: "Vega"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Today's Highlight
          </h2>
          <p className="text-gray-400 text-lg">
            The most loved moment of the day
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-gray-700 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
                  ⭐ Most Liked Today
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-relaxed">
                  "{dailyHighlight.dedication}"
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  Paired with <span className="text-blue-400 font-semibold">{dailyHighlight.star}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {dailyHighlight.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{dailyHighlight.user}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(dailyHighlight.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <span>❤️</span>
                  <span className="font-semibold">{dailyHighlight.likes} likes</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                href={`/moment/${dailyHighlight.id}`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                View Moment
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 