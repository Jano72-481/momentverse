'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: number;
}

export default function StarField() {
  const [isVisible, setIsVisible] = useState(false);

  // Reduced number of stars for better performance
  const stars = useMemo(() => {
    const starArray: Star[] = [];
    for (let i = 0; i < 60; i++) { // Reduced from 100 to 60
      starArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5, // Smaller stars
        opacity: Math.random() * 0.6 + 0.2, // Lower opacity
        animationDelay: Math.random() * 8,
      });
    }
    return starArray;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderStar = useCallback((star: Star) => (
    <div
      key={star.id}
      className="absolute w-1 h-1 bg-white rounded-full animate-star-parallax"
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        opacity: star.opacity,
        width: `${star.size}px`,
        height: `${star.size}px`,
        animationDelay: `${star.animationDelay}s`,
        willChange: 'transform, opacity',
      }}
      aria-hidden="true"
    />
  ), []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden" 
      aria-hidden="true"
      style={{ willChange: 'transform' }}
    >
      {stars.map(renderStar)}
    </div>
  );
} 