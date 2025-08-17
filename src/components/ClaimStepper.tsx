'use client';
import { useState } from 'react';
import TimePicker from './TimePicker';
import StarSelector from './StarSelector';
import { ClaimMomentForm } from './ClaimMomentForm';
import { Sparkles, Star, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { label: 'Choose Time', icon: <Sparkles className="w-5 h-5" /> },
  { label: 'Pick Star', icon: <Star className="w-5 h-5" /> },
  { label: 'Personalize', icon: <MessageSquare className="w-5 h-5" /> },
];

export default function ClaimStepper() {
  const [step, setStep] = useState(0);
  const [iso, setIso] = useState<string>();
  const [starId, setStarId] = useState<number>();

  // Stepper bar
  const Stepper = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center">
          <div className={`relative flex flex-col items-center z-10`}>
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
              ${i < step ? 'border-cyan-400 bg-gradient-to-br from-purple-600 to-cyan-500 shadow-lg' :
                i === step ? 'border-purple-400 bg-gradient-to-br from-purple-600 to-cyan-500 shadow-xl animate-pulse' :
                'border-slate-700 bg-slate-800'}
            `}>
              <span className={`text-white`}>{s.icon}</span>
            </div>
            <span className={`mt-2 text-xs font-semibold ${i === step ? 'text-purple-300' : 'text-slate-400'}`}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-10 h-1 mx-2 rounded-full transition-all duration-300
              ${i < step ? 'bg-gradient-to-r from-purple-500 to-cyan-400' : 'bg-slate-700'}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Stepper />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-2xl mb-4 font-bold text-center night-sky-gradient-text">1 · Choose the exact moment</h2>
            <TimePicker onSelect={(d) => { setIso(d); setStep(1); }} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center mb-4">
              <button onClick={() => setStep(0)} className="mr-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold night-sky-gradient-text">2 · Pair it with a star</h2>
            </div>
            <StarSelector onPick={(id) => { setStarId(id); setStep(2); }} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="flex items-center mb-4">
              <button onClick={() => setStep(1)} className="mr-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold night-sky-gradient-text">3 · Personalize & Checkout</h2>
            </div>
            <ClaimMomentForm 
              startTime={iso || new Date().toISOString().slice(0, 16)} 
              hasStarAddon={!!starId} 
              onSuccess={() => {}} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 