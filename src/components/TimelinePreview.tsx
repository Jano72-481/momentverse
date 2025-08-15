'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Star, Users, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

export default function TimelinePreview() {
  // Enhanced timeline data with more realistic moments
  const timelineMoments = [
    { 
      id: '1', 
      time: '09:15', 
      dedication: 'First sip of morning coffee - the perfect start to another day', 
      user: 'Alex Chen', 
      color: 'blue',
      stars: 3,
      likes: 12
    },
    { 
      id: '2', 
      time: '12:30', 
      dedication: 'Lunch with my best friend - these moments make life beautiful', 
      user: 'Maria Garcia', 
      color: 'purple',
      stars: 5,
      likes: 28
    },
    { 
      id: '3', 
      time: '15:45', 
      dedication: 'Afternoon walk in the park - nature always brings peace', 
      user: 'David Kim', 
      color: 'green',
      stars: 4,
      likes: 19
    },
    { 
      id: '4', 
      time: '18:20', 
      dedication: 'Watching the sunset with my partner - pure magic', 
      user: 'Emma Wilson', 
      color: 'orange',
      stars: 5,
      likes: 45
    },
    { 
      id: '5', 
      time: '21:00', 
      dedication: 'Evening reflection under the stars - grateful for today', 
      user: 'James Rodriguez', 
      color: 'pink',
      stars: 4,
      likes: 23
    },
  ];

  const getColorClass = (color: string) => {
    const colors = {
      blue: 'from-cyan-400 to-blue-500',
      purple: 'from-purple-400 to-pink-500',
      green: 'from-emerald-400 to-cyan-500',
      orange: 'from-orange-400 to-red-500',
      pink: 'from-pink-400 to-purple-500'
    };
    return colors[color as keyof typeof colors] || 'from-purple-400 to-cyan-500';
  };

  const getGlowClass = (color: string) => {
    const glows = {
      blue: 'shadow-cyan-500/50',
      purple: 'shadow-purple-500/50',
      green: 'shadow-emerald-500/50',
      orange: 'shadow-orange-500/50',
      pink: 'shadow-pink-500/50'
    };
    return glows[color as keyof typeof glows] || 'shadow-purple-500/50';
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="night-sky-h1 mb-6">
            Explore the Timeline
          </h2>
          <p className="night-sky-body max-w-3xl mx-auto text-lg">
            Discover moments dedicated by people around the world, each paired with a unique star from the cosmos
          </p>
        </motion.div>
      </div>

      {/* Stats Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">12,847</div>
          <div className="text-slate-300">Moments Dedicated</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">8,392</div>
          <div className="text-slate-300">Stars Paired</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">3,241</div>
          <div className="text-slate-300">Active Users</div>
        </div>
        <div className="glass-card p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-2">156K</div>
          <div className="text-slate-300">Total Views</div>
        </div>
      </motion.div>

      {/* Timeline Preview */}
      <motion.div 
        className="relative mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Timeline line with gradient and glow */}
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 transform -translate-y-1/2 rounded-full shadow-lg shadow-purple-500/30" />
        
        {/* Timeline moments */}
        <div className="relative flex justify-between items-center py-16">
          {timelineMoments.map((moment, index) => (
            <motion.div 
              key={moment.id} 
              className="flex flex-col items-center group cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Moment dot with enhanced hover effects */}
              <div 
                className={`w-6 h-6 bg-gradient-to-r ${getColorClass(moment.color)} rounded-full border-4 border-white shadow-lg group-hover:scale-150 group-hover:shadow-2xl group-hover:${getGlowClass(moment.color)} transition-all duration-300 mb-8 relative z-20`}
              >
                {/* Pulse animation */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getColorClass(moment.color)} opacity-0 group-hover:opacity-30 blur-md animate-pulse`} />
              </div>
              
              {/* Moment card with improved styling */}
              <div className="absolute top-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-30">
                <div className="glass-card p-6 shadow-2xl min-w-[280px] backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {moment.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{moment.stars}</span>
                      </div>
                      <div className="text-sm text-slate-400">❤️ {moment.likes}</div>
                    </div>
                  </div>
                  <div className="text-white font-medium mb-3 leading-relaxed line-clamp-3">{moment.dedication}</div>
                  <div className="text-sm night-sky-gradient-text">by {moment.user}</div>
                </div>
                {/* Arrow */}
                <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-slate-900/90 mx-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Interactive preview text */}
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <p className="night-sky-body text-lg">
            Hover over the dots to see moments • Click to explore the full timeline
          </p>
          <Sparkles className="w-5 h-5 text-cyan-400" />
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Link
          href="/timeline"
          className="btn-primary-night text-white font-semibold inline-flex items-center gap-3 px-8 py-4 text-lg"
        >
          Explore Full Timeline
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
} 