import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tip, TipCategory } from '../../types';

interface Props {
  tips: Tip[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_META: Record<TipCategory, { label: string; icon: string }> = {
  money: { label: 'Money', icon: '$' },
  safety: { label: 'Safety', icon: '⚠' },
  etiquette: { label: 'Etiquette', icon: '✦' },
  food: { label: 'Food', icon: '🍴' },
  transport: { label: 'Transport', icon: '➞' },
  health: { label: 'Health', icon: '✚' },
  general: { label: 'General', icon: '§' },
};
const ALL_CATEGORIES = Object.keys(CATEGORY_META) as TipCategory[];

type CategoryFilter = 'all' | TipCategory;

export default function TipsTab({ tips }: Props) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const presentCategories = useMemo(() => {
    const set = new Set<TipCategory>();
    tips.forEach((t) => { if (t.category) set.add(t.category); });
    return ALL_CATEGORIES.filter((c) => set.has(c));
  }, [tips]);

  // Keep original index so the expand panel still resolves correctly.
  const visibleTips = useMemo(() => {
    return tips
      .map((tip, idx) => ({ tip, idx }))
      .filter(({ tip }) => filter === 'all' || tip.category === filter);
  }, [tips, filter]);

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
      <div className="mb-8">
        <p className="eyebrow mb-3">Chapter VII — Counsel</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Words of <span className="italic text-[var(--gold)]">advice</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Practical notes — tap any card for the full story.</p>
      </div>

      {/* Category filter */}
      {presentCategories.length > 1 && (
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)] mb-2">Topic</p>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterChip>
            {presentCategories.map((c) => (
              <FilterChip key={c} active={filter === c} onClick={() => setFilter(c)}>
                <span className="mr-1.5">{CATEGORY_META[c].icon}</span>{CATEGORY_META[c].label}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

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
                  <p className="eyebrow mb-3">
                    {(selected.category && CATEGORY_META[selected.category]?.label) || 'Expanded'}
                  </p>
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
        {visibleTips.map(({ tip, idx }, i) => {
          const isSelected = selectedTip === idx;

          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
              onClick={() => setSelectedTip(isSelected ? null : idx)}
              className={`text-left surface-soft rounded-3xl p-6 transition-all duration-500 ${
                isSelected ? 'ring-1 ring-[var(--gold)]/40' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="eyebrow">{String(i + 1).padStart(2, '0')}</p>
                {tip.category && CATEGORY_META[tip.category] && (
                  <span className="text-[9px] tracking-[0.18em] uppercase text-[var(--text-dim)]">
                    {CATEGORY_META[tip.category].icon} {CATEGORY_META[tip.category].label}
                  </span>
                )}
              </div>
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
        active
          ? 'bg-[var(--cream)] text-[var(--ink)] font-medium'
          : 'border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)] hover:border-[var(--line-strong)]'
      }`}
    >
      {children}
    </button>
  );
}
