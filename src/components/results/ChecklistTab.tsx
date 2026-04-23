import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig } from '../../types';

interface Props {
  config: TravelConfig;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const CHECKLIST_ITEMS = [
  { id: 'passport', label: 'Passport valid for 6+ months beyond travel dates', category: 'Documents' },
  { id: 'visa', label: 'Visa applied for or requirements checked', category: 'Documents' },
  { id: 'insurance', label: 'Travel insurance purchased (comprehensive cover)', category: 'Documents' },
  { id: 'flights', label: 'All flights booked (international + domestic)', category: 'Bookings' },
  { id: 'hotels', label: 'Hotels booked for all destinations', category: 'Bookings' },
  { id: 'transfers', label: 'Airport transfers arranged', category: 'Bookings' },
  { id: 'tours', label: 'Tours and activities pre-booked where needed', category: 'Bookings' },
  { id: 'bank', label: 'Bank notified of travel dates (avoid card blocks)', category: 'Money' },
  { id: 'currency', label: 'Local currency or travel card arranged', category: 'Money' },
  { id: 'sim', label: 'SIM card or roaming plan sorted', category: 'Tech' },
  { id: 'apps', label: 'Offline maps and translation apps downloaded', category: 'Tech' },
  { id: 'chargers', label: 'Power adapter for destination country', category: 'Tech' },
  { id: 'copies', label: 'Document copies saved digitally (passport, insurance, bookings)', category: 'Safety' },
  { id: 'emergency', label: 'Emergency contacts shared with family/friends', category: 'Safety' },
  { id: 'vaccinations', label: 'Vaccinations checked with travel doctor', category: 'Health' },
  { id: 'medications', label: 'Prescriptions and basic meds packed', category: 'Health' },
  { id: 'packing', label: 'Packing complete (see Packing tab)', category: 'Packing' },
  { id: 'home', label: 'Home arrangements sorted (mail, pets, plants)', category: 'Home' },
];

export default function ChecklistTab({ config }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const total = CHECKLIST_ITEMS.length;
  const done = checked.size;
  const pct = total > 0 ? (done / total) * 100 : 0;

  const categories = Array.from(new Set(CHECKLIST_ITEMS.map((i) => i.category)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter V — Preparation</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Before you <span className="italic text-[var(--gold)]">depart</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">
          {config.country?.name ? `Preparing for ${config.country.name}. ` : ''}Mark items complete as you tick them off.
        </p>
      </div>

      {/* Progress */}
      <div className="surface-card rounded-3xl p-8 mb-10">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <p className="eyebrow mb-2">Progress</p>
            <p className="font-display text-4xl text-[var(--cream)] leading-none">
              {done}<span className="text-[var(--text-muted)] text-2xl"> / {total}</span>
            </p>
          </div>
          <p className="font-display italic text-3xl text-[var(--gold)]">{Math.round(pct)}%</p>
        </div>
        <div className="w-full h-[3px] bg-[var(--ink-4)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--gold)]"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </div>
        {done === total && (
          <p className="font-display italic text-[var(--gold)] mt-4">All set — safe travels.</p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((cat, ci) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
          return (
            <motion.section
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: ci * 0.05 }}
            >
              <div className="flex items-baseline gap-4 mb-4">
                <p className="eyebrow">Section</p>
                <h3 className="font-display italic text-2xl text-[var(--cream)]">{cat}</h3>
                <div className="flex-1 h-px bg-[var(--line)]" />
              </div>
              <div className="surface-soft rounded-3xl overflow-hidden">
                {items.map((item, idx) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[var(--ink-4)]/50 transition-colors ${
                        idx !== items.length - 1 ? 'border-b border-[var(--line)]' : ''
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                          isChecked
                            ? 'bg-[var(--gold)] border-[var(--gold)]'
                            : 'border-[var(--line-strong)]'
                        }`}
                      >
                        {isChecked && <span className="text-[var(--ink)] text-xs">✓</span>}
                      </div>
                      <span
                        className={`text-[15px] font-display-soft transition-all ${
                          isChecked
                            ? 'text-[var(--text-dim)] italic line-through'
                            : 'text-[var(--cream)]'
                        }`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
    </motion.div>
  );
}
