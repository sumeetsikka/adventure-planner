import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * First-run onboarding overlay.
 *
 * Shows once per device (decision saved to localStorage). 4 editorial steps
 * walk new users through the core flow. Dismissible at any step. Lives at the
 * top of the App tree so it overlays whatever view is rendered behind it.
 */

const KEY = 'adventure-planner:onboarded';
const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  {
    eyebrow: 'Welcome aboard',
    title: 'Plan your story.',
    body: 'Adventure Planner crafts a magazine-quality trip — itinerary, flights, hotels, restaurants, things to do — in one shot.',
    accent: '🧭',
  },
  {
    eyebrow: 'Step one',
    title: 'Pick your where.',
    body: 'Choose from 29 hand-curated countries with 400+ destinations, or get inspired by mood, season, and budget.',
    accent: '🌍',
  },
  {
    eyebrow: 'Step two',
    title: 'Tell us when.',
    body: 'Dates, travellers, vibes. We map an optimal route, fly from your origin, generate a full plan in under a minute.',
    accent: '📅',
  },
  {
    eyebrow: 'Step three',
    title: 'Travel, live.',
    body: 'Once your trip starts, the app switches to a live mode — today\'s plan, distance to your hotel, weather, and tap-to-navigate everywhere.',
    accent: '📊',
  },
];

interface Props {
  onClose?: () => void;
}

export default function OnboardingTour({ onClose }: Props = {}) {
  const [shown, setShown] = useState<boolean>(() => {
    try {
      return localStorage.getItem(KEY) !== '1';
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);

  // Slight delay so the page beneath has rendered first
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!shown) return;
    const t = setTimeout(() => setReady(true), 600);
    return () => clearTimeout(t);
  }, [shown]);

  const finish = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setShown(false);
    onClose?.();
  };

  const next = () => {
    if (step >= STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  };

  const skip = () => finish();

  if (!shown || !ready) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="fixed inset-0 z-[200] grain print:hidden"
        style={{ background: 'radial-gradient(ellipse at center, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.98) 70%)' }}
        role="dialog"
        aria-label="Welcome tour"
      >
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-md text-center"
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
              <span className="eyebrow">{current.eyebrow}</span>
            </div>
            <div className="text-7xl mb-8 text-[var(--gold)] leading-none">{current.accent}</div>
            <h2 className="font-display text-5xl sm:text-6xl text-[var(--cream)] leading-[0.95] mb-6">
              <em className="italic text-shimmer">{current.title}</em>
            </h2>
            <p className="text-[var(--text-muted)] text-base sm:text-lg font-light leading-relaxed mb-10">
              {current.body}
            </p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === step ? 'w-8 bg-[var(--gold)]' : 'w-1.5 bg-[var(--line-strong)]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={skip}
                className="px-5 py-3 rounded-full text-xs tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
              >
                Skip
              </button>
              <button
                onClick={next}
                className="px-8 py-3 rounded-full bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)] transition-colors text-sm font-medium tracking-wide"
              >
                {step === STEPS.length - 1 ? 'Begin' : 'Next →'}
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
