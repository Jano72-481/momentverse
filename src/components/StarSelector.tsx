'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import stars from '@/app/claim/star-data';
import StarField from './StarField';

interface Props {
  onPick: (starId: number) => void;
}

export default function StarSelector({ onPick }: Props) {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const handleStarClick = (starId: number) => {
    setSelectedStar(starId);
    // Immediate callback to prevent delay
    setTimeout(() => onPick(starId), 0);
  };

  const handleRandom = () => {
    if (stars.length === 0) return;
    const randomStar = stars[Math.floor(Math.random() * stars.length)];
    if (randomStar) {
      setSelectedStar(randomStar.id);
      // Immediate callback to prevent delay
      setTimeout(() => onPick(randomStar.id), 0);
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <StarField />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 night-sky-gradient-text">Choose Your Star</h3>
            <p className="text-slate-300">Select a real star from the cosmos to pair with your moment</p>
          </div>
          <button
            type="button"
            onClick={handleRandom}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all"
          >
            Random Star
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto glass-card p-4 bg-slate-900/70">
          {stars.slice(0, 20).map((star) => (
            <motion.button
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 relative
                ${selectedStar === star.id 
                  ? 'border-cyan-400 bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg animate-pulse' 
                  : 'border-slate-700 bg-slate-800/60 hover:border-purple-500 hover:bg-slate-700/60'}
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Star className={`w-5 h-5 ${selectedStar === star.id ? 'text-cyan-300 animate-pulse' : 'text-purple-300'}`} />
                <span className="text-xs text-slate-400">#{star.id}</span>
              </div>
              <div className="text-center">
                <div className="font-semibold text-white mb-1">{star.name}</div>
                <div className="text-xs text-slate-400">
                  Magnitude: {(Math.random() * 2 + 0.5).toFixed(1)}
                </div>
              </div>
              {selectedStar === star.id && (
                <motion.div
                  className="absolute inset-0 rounded-lg border-2 border-cyan-400 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ boxShadow: '0 0 24px 8px #22d3ee55' }}
                />
              )}
            </motion.button>
          ))}
        </div>
        {selectedStar && (
          <motion.div
            className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-cyan-400/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white font-medium text-center">
              Selected: {stars.find(s => s.id === selectedStar)?.name} ✨
            </p>
            <p className="text-slate-300 text-sm text-center mt-1">
              This star will be paired with your moment for eternity
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
} 