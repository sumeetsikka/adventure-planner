import { useState } from 'react';
import { motion } from 'framer-motion';
import type { BudgetItem, TravelConfig } from '../../types';
import { generateBudget } from '../../lib/api';

interface Props {
  budget: BudgetItem[];
  config: TravelConfig;
  onUpdate?: (budget: BudgetItem[]) => void;
}

function parseCostMid(cost: string): number {
  const nums = cost.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseInt(n.replace(/,/g, '')));
  if (values.length === 1) return values[0];
  return Math.round((values[0] + values[1]) / 2);
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BudgetTab({ budget, config, onUpdate }: Props) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onUpdate) return;
    setRetrying(true);
    try {
      const result = await generateBudget(config);
      onUpdate(result);
    } catch (err) {
      console.error('Budget retry failed:', err);
    } finally {
      setRetrying(false);
    }
  };

  if (budget.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">The numbers</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-3">Budget <em>not ready</em>.</h2>
        <p className="text-[var(--text-muted)] text-sm mb-8 max-w-md mx-auto">
          This can happen if the AI service was busy. Try again.
        </p>
        {onUpdate && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-7 py-3 rounded-full font-medium text-[var(--ink)] bg-[var(--cream)] hover:opacity-90 transition-all disabled:opacity-50"
          >
            {retrying ? 'Calculating…' : 'Generate budget'}
          </button>
        )}
      </div>
    );
  }

  const perPersonTotal = budget.reduce((sum, item) => sum + parseCostMid(item.cost), 0);
  const groupTotal = perPersonTotal * config.travellers;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">Costed · {budget.length} categories</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">numbers</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Complete cost breakdown — flights, hotels, activities, transport.
        </p>
      </div>

      {/* Totals spread */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="surface-card rounded-3xl p-8"
        >
          <p className="eyebrow mb-4">Per person</p>
          <p className="font-display text-5xl sm:text-6xl text-[var(--cream)] leading-none tracking-tight">
            ${perPersonTotal.toLocaleString()}
          </p>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-4">estimated total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="surface-card rounded-3xl p-8"
        >
          <p className="eyebrow mb-4">Group · {config.travellers} traveller{config.travellers > 1 ? 's' : ''}</p>
          <p className="font-display text-5xl sm:text-6xl text-[var(--gold)] leading-none tracking-tight">
            ${groupTotal.toLocaleString()}
          </p>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-4">estimated total</p>
        </motion.div>
      </div>

      {/* Category list */}
      <div className="surface-card rounded-3xl overflow-hidden mb-10">
        <div className="px-7 py-5 border-b border-[var(--line)]">
          <p className="eyebrow">Breakdown</p>
        </div>
        <ul>
          {budget.map((item, i) => {
            const mid = parseCostMid(item.cost);
            const pct = perPersonTotal > 0 ? (mid / perPersonTotal) * 100 : 0;

            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.035, ease: EASE }}
                className="px-7 py-5 border-b border-[var(--line)] last:border-b-0 hover:bg-[var(--ink-3)] transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-[var(--cream)] leading-snug">{item.category}</p>
                  </div>
                  <p className="font-display text-2xl text-[var(--gold)] flex-shrink-0">{item.cost}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[2px] bg-[var(--line)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--gold)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(pct, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.04, ease: EASE }}
                    />
                  </div>
                  <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider w-10 text-right">
                    {Math.round(pct)}%
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {/* Cost comparison */}
      {perPersonTotal > 0 && (() => {
        const benchmarks: Record<string, number> = {
          vietnam: 80, thailand: 90, japan: 180, indonesia: 100, philippines: 85, cambodia: 70,
          italy: 200, france: 220, spain: 170, portugal: 150, greece: 160, switzerland: 300,
          germany: 180, netherlands: 190, belgium: 175, austria: 190, norway: 250, sweden: 220,
          morocco: 90, egypt: 80, turkey: 100, mauritius: 180, peru: 100, mexico: 110,
          newzealand: 180, maldives: 350, croatia: 150, iceland: 280, fiji: 200,
        };
        const countryId = config.country?.id || '';
        const avgDaily = benchmarks[countryId];
        if (!avgDaily) return null;

        const totalDays = Math.round(
          (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        const avgTotal = avgDaily * totalDays;
        const diff = perPersonTotal - avgTotal;
        const diffPct = Math.round((diff / avgTotal) * 100);
        const isBelow = diff < 0;
        const isAbove = diff > 0;

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="surface-card rounded-3xl p-8"
          >
            <p className="eyebrow mb-4">In context</p>
            <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-6">
              How does your trip <em className="italic text-[var(--gold)]">compare</em>?
            </h3>

            <div className="space-y-5 mb-5">
              <div>
                <div className="flex items-baseline justify-between text-[11px] uppercase tracking-wider mb-2">
                  <span className="text-[var(--text-muted)]">Average for {config.country?.name}</span>
                  <span className="font-display text-lg text-[var(--text)] normal-case tracking-normal">
                    ${avgTotal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[var(--line)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--text-dim)]" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-[11px] uppercase tracking-wider mb-2">
                  <span className="text-[var(--text-muted)]">Your trip</span>
                  <span className={`font-display text-lg normal-case tracking-normal ${isBelow ? 'text-[var(--sage)]' : 'text-[var(--gold)]'}`}>
                    ${perPersonTotal.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[var(--line)] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isBelow ? 'bg-[var(--sage)]' : 'bg-[var(--gold)]'}`}
                    style={{ width: `${Math.min(100, (perPersonTotal / avgTotal) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <p className={`font-display italic text-base ${isBelow ? 'text-[var(--sage)]' : isAbove ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]'}`}>
              {isBelow ? `${Math.abs(diffPct)}% below the average — great value.` :
               isAbove ? `${diffPct}% above the average — going premium.` :
               'Right on the average.'}
            </p>
            <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mt-3">
              Based on ~${avgDaily}/day for mid-range Australian travellers · {totalDays} days
            </p>
          </motion.div>
        );
      })()}

      <p className="text-[var(--text-dim)] text-[10px] text-center mt-8 tracking-wider uppercase">
        Estimates based on typical Australian traveller costs. Prices vary by season.
      </p>
    </motion.div>
  );
}
