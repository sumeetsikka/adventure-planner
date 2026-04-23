import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getCountryHero } from '../../lib/imagery';

interface Props {
  destinations: string[];
  progress: {
    route: boolean;
    flights: boolean;
    hotels: boolean;
    itinerary: boolean;
    budget: boolean;
    tips: boolean;
    packing: boolean;
    weather: boolean;
    visa: boolean;
    currency: boolean;
    nearby: boolean;
    transport: boolean;
  };
}

const STEPS = [
  { key: 'route', label: 'Mapping your route' },
  { key: 'itinerary', label: 'Composing the itinerary' },
  { key: 'flights', label: 'Scouting flights' },
  { key: 'hotels', label: 'Curating hotels' },
  { key: 'transport', label: 'Planning inter-city journeys' },
  { key: 'budget', label: 'Calculating the budget' },
  { key: 'tips', label: 'Gathering insider tips' },
  { key: 'packing', label: 'Packing your bag' },
  { key: 'weather', label: 'Reading the skies' },
  { key: 'visa', label: 'Checking visas' },
  { key: 'currency', label: 'Exchanging currency notes' },
  { key: 'nearby', label: 'Uncovering nearby gems' },
] as const;

export default function LoadingScreen({ destinations, progress }: Props) {
  const [destIndex, setDestIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const intervalRef = useRef<number | null>(null);

  const doneCount = Object.values(progress).filter(Boolean).length;
  const totalCount = STEPS.length;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  useEffect(() => {
    if (destinations.length === 0) return;
    let charIndex = 0;
    const target = destinations[destIndex];
    setDisplayText('');

    intervalRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayText(target.slice(0, charIndex));
      if (charIndex >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setDestIndex((prev) => (prev + 1) % destinations.length);
        }, 1400);
      }
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [destIndex, destinations]);

  const heroImage = destinations.length > 0 ? getCountryHero(destinations[destIndex] || destinations[0], 2000, 1200) : '';

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
      {/* Cinematic hero */}
      <div className="fixed inset-0 overflow-hidden">
        {heroImage && (
          <motion.img
            key={destIndex}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            src={heroImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
          />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.75) 0%, rgba(10,8,6,0.6) 40%, rgba(10,8,6,0.95) 100%)' }} />
      </div>

      <div className="relative z-10 max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="eyebrow mb-5">Now writing</p>
          <h1 className="font-display text-5xl sm:text-7xl text-[var(--cream)] mb-3 leading-tight min-h-[5rem]">
            <em className="italic text-shimmer">{displayText}</em>
            <span className="animate-gentle-pulse text-[var(--gold)] font-thin">|</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base font-light mb-10 italic font-display-soft">
            Crafting every chapter of your story.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="max-w-sm mx-auto mb-10">
          <div className="flex items-baseline justify-between mb-2">
            <span className="eyebrow text-[var(--text-muted)]">{doneCount} of {totalCount}</span>
            <span className="font-display text-xl text-[var(--gold)]">{Math.round(pct)}%</span>
          </div>
          <div className="w-full h-px bg-[var(--line)] overflow-hidden">
            <motion.div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, var(--gold), var(--terracotta-soft))' }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2 text-left max-w-xs mx-auto">
          {STEPS.map((step, i) => {
            const done = progress[step.key as keyof typeof progress];
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  {done ? (
                    <span className="text-[var(--gold)] text-sm">✓</span>
                  ) : (
                    <div className="w-3 h-3 border border-[var(--text-dim)] border-t-[var(--gold)] rounded-full animate-spin" />
                  )}
                </div>
                <span className={`text-xs font-light tracking-wide ${done ? 'text-[var(--cream)]' : 'text-[var(--text-dim)]'}`}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
