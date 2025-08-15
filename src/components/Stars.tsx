'use client';
import { useEffect, useState } from 'react';

interface Props {
  className?: string;
}

export default function Stars({ className }: Props) {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }));
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
      {/* Additional larger stars for depth */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`large-${i}`}
          className="absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
} 