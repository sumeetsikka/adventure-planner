import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PackingItem, TravelConfig } from '../../types';
import { tapHaptic } from '../../lib/haptics';

interface Props {
  packing: PackingItem[];
  config?: TravelConfig;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function classifyCategory(name: string): 'clothing' | 'shoes' | 'toiletries' | 'electronics' | 'documents' | 'other' {
  const n = name.toLowerCase();
  if (n.includes('shoe') || n.includes('footwear')) return 'shoes';
  if (n.includes('toiletr') || n.includes('hygiene') || n.includes('grooming')) return 'toiletries';
  if (n.includes('electron') || n.includes('tech') || n.includes('gadget')) return 'electronics';
  if (n.includes('document') || n.includes('paper') || n.includes('travel essentials')) return 'documents';
  if (n.includes('cloth') || n.includes('apparel') || n.includes('wear')) return 'clothing';
  return 'other';
}

function classifyItem(item: string): 'shoes' | 'clothing' | 'electronics' | 'documents' | 'other' {
  const n = item.toLowerCase();
  if (/(shoes|sneakers|boots|sandals|trainers|flats|heels|slippers|footwear)/.test(n)) return 'shoes';
  if (/(passport|visa|insurance|ticket|booking|copies|licence|license|card)/.test(n)) return 'documents';
  if (/(charger|adapter|laptop|camera|phone|earbuds|headphone|kindle|cable|battery|power)/.test(n)) return 'electronics';
  if (/(shirt|pants|trouser|dress|jacket|coat|sweater|jumper|jeans|shorts|socks|underwear|bra|hat|scarf|gloves|swim|bikini|jersey|top|skirt)/.test(n)) return 'clothing';
  return 'other';
}

export default function PackingTab({ packing, config: _config }: Props) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (packing.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">In the bag</p>
        <h2 className="font-display text-3xl text-[var(--cream)]">Compiling your <em>list</em>…</h2>
      </div>
    );
  }

  const totalItems = packing.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedCount = checkedItems.size;
  const progressPct = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  function toggleItem(category: string, item: string) {
    tapHaptic();
    const key = `${category}-${item}`;
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const categoryWeights: Record<string, number> = {
    Clothing: 0.35, Toiletries: 0.15, Electronics: 0.4, Documents: 0.05, Activities: 0.5,
  };
  const defaultWeight = 0.2;
  const totalWeight = packing.reduce((sum, cat) => {
    const wPerItem = categoryWeights[cat.category] || defaultWeight;
    return sum + cat.items.length * wPerItem;
  }, 0);
  const roundedWeight = Math.round(totalWeight * 10) / 10;

  const AIRLINE_LIMITS = [
    { name: 'Jetstar', checked: 20, carry: 7 },
    { name: 'Qantas', checked: 23, carry: 7 },
    { name: 'Singapore Airlines', checked: 25, carry: 7 },
    { name: 'Vietnam Airlines', checked: 23, carry: 7 },
    { name: 'AirAsia', checked: 20, carry: 7 },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-10">
        <p className="eyebrow mb-3">In the bag · {packing.length} categories</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">list</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Weather-appropriate essentials for the trip. Tick items as you pack.</p>
      </div>

      {/* Smart weight panel */}
      {(() => {
        const W_CLOTHING = 0.2;
        const W_SHOES = 0.8;
        const W_ELECTRONICS_PER_ITEM = 0.3;
        const W_DOCUMENTS = 0.2;
        const TOILETRIES_PER_PERSON = 1.5;

        let weightKg = 0;
        let hasToiletries = false;
        for (const cat of packing) {
          const catKind = classifyCategory(cat.category);
          if (catKind === 'toiletries') { hasToiletries = true; continue; }
          for (const item of cat.items) {
            const kind = catKind === 'other' ? classifyItem(item) : catKind;
            if (kind === 'shoes') weightKg += W_SHOES;
            else if (kind === 'electronics') weightKg += W_ELECTRONICS_PER_ITEM;
            else if (kind === 'documents') weightKg += W_DOCUMENTS;
            else weightKg += W_CLOTHING;
          }
        }
        if (hasToiletries) weightKg += TOILETRIES_PER_PERSON;

        const perPerson = Math.round(weightKg * 10) / 10;
        const QANTAS = 23;
        const pctOf23 = Math.min(100, (perPerson / QANTAS) * 100);
        let bar: string = 'var(--sage)';
        if (perPerson > QANTAS) bar = 'var(--terracotta)';
        else if (perPerson > 18) bar = 'var(--gold)';

        const limits = [
          { name: 'Qantas', kg: 23 },
          { name: 'Jetstar', kg: 20 },
          { name: 'AirAsia', kg: 15 },
          { name: 'Ryanair (chk)', kg: 10 },
          { name: 'Ryanair (cab)', kg: 7 },
        ];
        const overSomething = limits.some((l) => perPerson > l.kg);

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="surface-card rounded-3xl p-7 mb-6"
          >
            <div className="flex items-baseline justify-between mb-5 gap-4 flex-wrap">
              <div>
                <p className="eyebrow mb-2">Weight · per traveller</p>
                <p className="font-display text-5xl text-[var(--cream)] leading-none tracking-tight">
                  {perPerson}<span className="text-lg text-[var(--text-dim)]"> kg</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider">vs Qantas 23 kg</p>
                <p className="font-display text-2xl" style={{ color: bar }}>
                  {perPerson > QANTAS
                    ? `+${(perPerson - QANTAS).toFixed(1)} over`
                    : `${(QANTAS - perPerson).toFixed(1)} kg spare`}
                </p>
              </div>
            </div>

            <div
              className="relative w-full h-2.5 rounded-full overflow-hidden mb-2"
              style={{ background: 'linear-gradient(90deg, rgba(122,150,108,0.25) 0%, rgba(196,160,90,0.25) 60%, rgba(196,99,75,0.25) 100%)' }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pctOf23}%` }}
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute left-0 top-0 bottom-0"
                style={{ background: bar, opacity: 0.85 }}
              />
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-dim)] mb-5">
              <span>0 kg</span>
              <span>23 kg</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
              {limits.map((l) => {
                const over = perPerson > l.kg;
                return (
                  <div key={l.name} className="surface-soft rounded-2xl px-3 py-3">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{l.name}</p>
                    <p className="font-display text-lg" style={{ color: over ? 'var(--terracotta)' : 'var(--sage)' }}>
                      {l.kg} kg
                    </p>
                  </div>
                );
              })}
            </div>

            {overSomething && (
              <p className="font-display italic text-sm" style={{ color: 'var(--terracotta)' }}>
                Remove non-essentials to save ~3.5 kg.
              </p>
            )}

            <p className="text-[var(--text-dim)] text-[10px] mt-3 tracking-wider uppercase">
              Estimate · clothing 200g · shoes 800g · toiletries 1.5kg · electronics ~1.5kg · documents 200g
            </p>
          </motion.div>
        );
      })()}

      {/* Progress */}
      <div className="surface-card rounded-3xl p-7 mb-6">
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <p className="eyebrow mb-2">Packed</p>
            <p className="font-display text-4xl text-[var(--cream)]">
              {packedCount}<span className="text-[var(--text-dim)]"> / {totalItems}</span>
            </p>
          </div>
          <p className="font-display text-5xl text-[var(--gold)] leading-none">
            {Math.round(progressPct)}<span className="text-xl">%</span>
          </p>
        </div>
        <div className="w-full h-[3px] bg-[var(--line)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[var(--gold)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, ease: EASE }}
          />
        </div>
      </div>

      {/* Weight estimate */}
      <div className="surface-card rounded-3xl p-7 mb-10">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <p className="eyebrow mb-2">Estimated weight</p>
            <p className="font-display text-lg text-[var(--cream)]">Against common airline limits</p>
          </div>
          <p className="font-display text-4xl text-[var(--gold)] leading-none">
            {roundedWeight}<span className="text-lg"> kg</span>
          </p>
        </div>

        <div className="space-y-4">
          {AIRLINE_LIMITS.map((airline) => {
            const pct = Math.min(100, (roundedWeight / airline.checked) * 100);
            const isOver = roundedWeight > airline.checked;
            return (
              <div key={airline.name}>
                <div className="flex items-baseline justify-between text-[11px] uppercase tracking-wider mb-2">
                  <span className="text-[var(--text-muted)]">{airline.name} · {airline.checked}kg</span>
                  <span className={isOver ? 'text-[var(--terracotta)]' : 'text-[var(--sage)]'}>
                    {isOver ? `${(roundedWeight - airline.checked).toFixed(1)}kg over` : `${(airline.checked - roundedWeight).toFixed(1)}kg spare`}
                  </span>
                </div>
                <div className="w-full h-[2px] bg-[var(--line)] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${isOver ? 'bg-[var(--terracotta)]' : 'bg-[var(--sage)]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[var(--text-dim)] text-[10px] mt-5 tracking-wider uppercase">
          Rough estimate. Check your airline's baggage policy.
        </p>
      </div>

      {/* Category checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {packing.map((cat, i) => {
          const catDone = cat.items.filter((item) => checkedItems.has(`${cat.category}-${item}`)).length;

          return (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              className="surface-card rounded-3xl p-7"
            >
              <div className="flex items-end justify-between mb-5">
                <div>
                  <p className="eyebrow mb-1">Section {String(i + 1).padStart(2, '0')}</p>
                  <h4 className="font-display text-2xl text-[var(--cream)]">{cat.category}</h4>
                </div>
                <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider">
                  {catDone} / {cat.items.length}
                </p>
              </div>
              <div className="divider mb-5" />

              <ul className="space-y-1">
                {cat.items.map((item, j) => {
                  const key = `${cat.category}-${item}`;
                  const checked = checkedItems.has(key);
                  return (
                    <li key={j}>
                      <label className="flex items-center gap-4 cursor-pointer group/item py-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleItem(cat.category, item)}
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            checked
                              ? 'border-[var(--gold)] bg-[var(--gold)]'
                              : 'border-[var(--line-strong)] group-hover/item:border-[var(--gold)]/60'
                          }`}
                        >
                          {checked && <span className="text-[var(--ink)] text-[9px] font-bold">✓</span>}
                        </span>
                        <span
                          className={`text-[14px] transition-all ${
                            checked
                              ? 'line-through text-[var(--text-dim)]'
                              : 'text-[var(--text)] group-hover/item:text-[var(--cream)]'
                          }`}
                        >
                          {item}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}
      </div>
    </motion.div>
  );
}
