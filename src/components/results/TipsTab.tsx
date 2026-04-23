import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tip } from '../../types';

interface Props {
  tips: Tip[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function TipsTab({ tips }: Props) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  if (tips.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Counsel</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Gathering <span className="text-[var(--gold)]">wisdom</span>…</p>
      </div>
    );
  }

  const selected = selectedTip !== null ? tips[selectedTip] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter VII — Counsel</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Words of <span className="italic text-[var(--gold)]">advice</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Practical notes — tap any card for the full story.</p>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mb-8 overflow-hidden"
          >
            <div className="surface-card rounded-3xl p-8">
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  <p className="eyebrow mb-3">Expanded</p>
                  <h3 className="font-display italic text-3xl text-[var(--cream)] leading-tight">{selected.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedTip(null)}
                  className="shrink-0 w-10 h-10 rounded-full border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-4)] flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="divider mb-5" />
              <p className="font-display-soft text-[var(--cream)] text-[17px] leading-relaxed">{selected.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip, i) => {
          const isSelected = selectedTip === i;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              onClick={() => setSelectedTip(isSelected ? null : i)}
              className={`text-left surface-soft rounded-3xl p-6 transition-all duration-500 ${
                isSelected ? 'ring-1 ring-[var(--gold)]/40' : ''
              }`}
            >
              <p className="eyebrow mb-3">{String(i + 1).padStart(2, '0')}</p>
              <h4 className="font-display text-xl text-[var(--cream)] leading-tight mb-3">{tip.title}</h4>
              <p className="text-[var(--text-muted)] text-[13px] leading-relaxed line-clamp-3">{tip.text}</p>
              <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <span className="eyebrow">Read more</span>
                <span className="text-[var(--gold)] text-lg font-display">→</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
