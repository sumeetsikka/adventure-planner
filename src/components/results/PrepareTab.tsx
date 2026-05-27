import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig, VisaInfo } from '../../types';
import {
  buildReadinessItems,
  daysUntilDeparture,
  loadCompleted,
  toggleCompleted,
  readinessProgress,
  type ReadinessItem,
} from '../../lib/readiness';
import { getActiveTripId } from '../../lib/tripStore';

/**
 * Pre-trip readiness countdown.
 *
 * Shows a timeline of what to do before departure, grouped by category, with
 * deadlines relative to the trip start date. Persists completion state so the
 * traveller can tick items off across sessions.
 *
 * Auto-hides when the trip is in progress or in the past — at that point the
 * Dashboard surfaces "live" content instead.
 */

interface Props {
  config: TravelConfig;
  visa: VisaInfo | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  documents: { label: 'Documents', icon: '📄' },
  money: { label: 'Money', icon: '💰' },
  logistics: { label: 'Logistics', icon: '🧳' },
  health: { label: 'Health', icon: '💉' },
  house: { label: 'House & home', icon: '🏠' },
};

export default function PrepareTab({ config, visa }: Props) {
  const items = useMemo(() => buildReadinessItems(config, visa), [config, visa]);
  const tripId = getActiveTripId() || 'default';
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => loadCompleted(tripId));
  const daysToGo = daysUntilDeparture(config.departureDate);
  const progress = readinessProgress(items, completed);

  const toggle = (id: ReadinessItem['id']) => {
    const next = { ...completed };
    if (next[id]) delete next[id];
    else next[id] = true;
    setCompleted(next);
    toggleCompleted(tripId, id, !!next[id]);
  };

  // Group by category for the panel layout.
  const grouped = useMemo(() => {
    const g: Record<string, ReadinessItem[]> = {};
    for (const item of items) {
      if (!g[item.category]) g[item.category] = [];
      g[item.category].push(item);
    }
    return g;
  }, [items]);

  // After-trip state — celebrate, don't nag.
  if (Number.isFinite(daysToGo) && daysToGo < -1) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center py-20">
        <p className="text-6xl mb-6">🎉</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-2">Welcome back.</h2>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">Your trip is in the past. Head to the Journal tab to capture memories.</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-3">Before you go · {items.length} steps</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          Ready to <em className="italic text-[var(--terracotta)]">depart</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Tick each item off as you go — we'll surface the urgent ones first.
        </p>
      </div>

      {/* Countdown + Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
          className="surface-card rounded-3xl p-8"
        >
          <p className="eyebrow mb-4">Countdown</p>
          {Number.isFinite(daysToGo) ? (
            daysToGo > 0 ? (
              <>
                <p className="font-display text-6xl text-[var(--cream)] leading-none">{daysToGo}</p>
                <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-3">
                  day{daysToGo === 1 ? '' : 's'} until departure
                </p>
              </>
            ) : daysToGo === 0 ? (
              <>
                <p className="font-display text-6xl text-[var(--terracotta)] leading-none">Today</p>
                <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-3">you fly today — bon voyage</p>
              </>
            ) : (
              <>
                <p className="font-display text-6xl text-[var(--sage)] leading-none">Day {Math.abs(daysToGo) + 1}</p>
                <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-3">of your trip</p>
              </>
            )
          ) : (
            <p className="text-[var(--text-dim)] text-sm">Set a departure date to start the countdown.</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          className="surface-card rounded-3xl p-8"
        >
          <p className="eyebrow mb-4">Readiness</p>
          <p className="font-display text-6xl text-[var(--terracotta)] leading-none">{progress}<span className="text-3xl text-[var(--text-dim)]">%</span></p>
          <div className="w-full h-2 bg-[var(--ink-4)] rounded-full overflow-hidden mt-5">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--terracotta)' }}
              initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mt-3">
            {items.filter(i => completed[i.id]).length} of {items.length} done
          </p>
        </motion.div>
      </div>

      {/* Grouped checklist */}
      <div className="space-y-8">
        {Object.entries(grouped).map(([cat, catItems]) => {
          const meta = CATEGORY_META[cat] || { label: cat, icon: '·' };
          return (
            <motion.section
              key={cat}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-display text-xl text-[var(--cream)]">
                  <span className="mr-2">{meta.icon}</span>{meta.label}
                </h3>
                <span className="eyebrow text-[var(--text-dim)]">
                  {catItems.filter(i => completed[i.id]).length}/{catItems.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {catItems.map((item) => {
                  const isDone = !!completed[item.id];
                  const urgency = daysToGo - item.daysBefore;
                  const isUrgent = !isDone && Number.isFinite(daysToGo) && daysToGo <= item.daysBefore;
                  const isOverdue = !isDone && Number.isFinite(daysToGo) && urgency < 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`w-full text-left surface-card rounded-2xl p-5 flex items-start gap-4 transition-all ${
                        isDone ? 'opacity-55' : ''
                      }`}
                      style={isOverdue ? { borderColor: 'color-mix(in srgb, var(--terracotta) 35%, transparent)' } : undefined}
                    >
                      {/* Checkbox */}
                      <span
                        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0 ${
                          isDone
                            ? 'bg-[var(--sage)] border-[var(--sage)] text-white'
                            : 'border-[var(--line-strong)] text-transparent'
                        }`}
                        aria-hidden
                      >
                        ✓
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
                          <p className={`font-display-soft text-base ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--cream)]'}`}>
                            <span className="mr-1.5">{item.icon}</span>{item.label}
                          </p>
                          <span
                            className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full ${
                              isDone
                                ? 'bg-[var(--sage)]/10 text-[var(--sage)]'
                                : isOverdue
                                  ? 'bg-[var(--terracotta)]/10 text-[var(--terracotta)]'
                                  : isUrgent
                                    ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                                    : 'bg-[var(--ink-4)] text-[var(--text-muted)]'
                            }`}
                          >
                            {isDone ? 'Done' : isOverdue ? 'Overdue' : isUrgent ? 'Soon' : `T−${item.daysBefore}d`}
                          </span>
                        </div>
                        <p className={`text-[13px] leading-relaxed ${isDone ? 'text-[var(--text-dim)]' : 'text-[var(--text-muted)]'}`}>
                          {item.detail}
                        </p>
                        {item.link && !isDone && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-block mt-2.5 text-[11px] font-semibold tracking-wide uppercase text-[var(--terracotta)] hover:underline"
                          >
                            Open link ↗
                          </a>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      <p className="text-[var(--text-dim)] text-[10px] text-center mt-10 tracking-wider uppercase">
        Your completion state is saved on this device only.
      </p>
    </motion.div>
  );
}
