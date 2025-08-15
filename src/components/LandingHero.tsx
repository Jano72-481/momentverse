'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Stars from './Stars';

export default function LandingHero() {
  return (
    <section className="relative h-[92vh] overflow-hidden">
      {/* 3‑D starfield */}
      <Stars className="absolute inset-0" />
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-400 via-pink-400 to-red-400"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 70 }}
        >
          Dedicate&nbsp;
          <span className="whitespace-nowrap">Your Moment</span>
          <br />to Eternity ✨
        </motion.h1>
        <motion.p
          className="mt-6 max-w-xl text-lg md:text-xl text-brand-100"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Claim any second in history, pair it with a real star, and share a
          beautiful certificate that lasts forever.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/claim"
            className="px-8 py-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg shadow-brand-500/40 transition-transform active:scale-95"
          >
            Claim Your Moment
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 