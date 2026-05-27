import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { BudgetItem, TravelConfig, FlightLeg, TransportLeg } from '../../types';
import { generateBudget } from '../../lib/api';
import { fetchRate, CURRENCY_SYMBOLS } from '../../lib/fx';
import {
  flightCO2kg,
  trainCO2kg,
  carCO2kg,
  busCO2kg,
  estimateLegDistance,
  isAirportCode,
  LONG_HAUL_FALLBACK_KM,
} from '../../lib/carbon';

const CURRENCY_CHIPS = ['AUD', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'NZD', 'CAD', 'INR', 'AED', 'HKD', 'ZAR'];

interface Props {
  budget: BudgetItem[];
  config: TravelConfig;
  onUpdate?: (budget: BudgetItem[]) => void;
  flights?: FlightLeg[];
  transport?: TransportLeg[];
}

function transportCO2(mode: string, km: number): number {
  const m = (mode || '').toLowerCase();
  if (m.includes('train') || m.includes('rail')) return trainCO2kg(km);
  if (m.includes('bus') || m.includes('coach')) return busCO2kg(km);
  if (m.includes('car') || m.includes('drive') || m.includes('taxi')) return carCO2kg(km);
  if (m.includes('flight') || m.includes('plane')) return flightCO2kg(km);
  return carCO2kg(km);
}

function parseCostMid(cost: string): number {
  const nums = cost.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseInt(n.replace(/,/g, '')));
  if (values.length === 1) return values[0];
  return Math.round((values[0] + values[1]) / 2);
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BudgetTab({ budget, config, onUpdate, flights = [], transport = [] }: Props) {
  const [retrying, setRetrying] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<string>(config.homeCurrency || 'AUD');
  const [fxRate, setFxRate] = useState<number | null>(1);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxFailed, setFxFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (displayCurrency === 'AUD') {
        setFxRate(1);
        setFxFailed(false);
        return;
      }
      setFxLoading(true);
      setFxFailed(false);
      const rate = await fetchRate('AUD', displayCurrency);
      if (cancelled) return;
      if (rate == null) {
        setFxRate(null);
        setFxFailed(true);
      } else {
        setFxRate(rate);
      }
      setFxLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [displayCurrency]);

  const effectiveCurrency = fxFailed || fxRate == null ? 'AUD' : displayCurrency;
  const effectiveRate = fxFailed || fxRate == null ? 1 : fxRate;
  const symbol = CURRENCY_SYMBOLS[effectiveCurrency] || '';

  const formatMoney = (audAmount: number): string => {
    // All supported display currencies are rendered as integers for a clean
    // editorial look (JPY/INR have no fractional units; AUD/USD/EUR/etc.
    // round to whole units to keep the layout tidy in the totals cards).
    const v = audAmount * effectiveRate;
    return `${symbol}${Math.round(v).toLocaleString()}`;
  };

  const convertCostString = (cost: string): string => {
    // Replace each numeric run in the cost string (e.g. "$120-180") with converted value.
    return cost.replace(/[\d,]+/g, (match) => {
      const n = parseInt(match.replace(/,/g, ''), 10);
      if (!isFinite(n)) return match;
      const converted = Math.round(n * effectiveRate);
      return converted.toLocaleString();
    }).replace(/\$/g, symbol || '$');
  };

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
            className="px-7 py-3 rounded-full font-medium text-white bg-[var(--terracotta)] hover:opacity-90 transition-all disabled:opacity-50"
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
      <div className="mb-8">
        <p className="eyebrow mb-3">Costed · {budget.length} categories</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">numbers</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Complete cost breakdown — flights, hotels, activities, transport.
        </p>
      </div>

      {/* Currency toggle */}
      <div className="surface-soft p-5 mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <span className="eyebrow">Show in</span>
          <span className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase">
            {fxLoading ? 'Fetching rate…' : fxFailed ? 'Falling back to AUD' : effectiveCurrency === 'AUD' ? 'Source currency' : `1 AUD = ${effectiveRate.toFixed(3)} ${effectiveCurrency}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CURRENCY_CHIPS.map((c) => {
            const isActive = displayCurrency === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setDisplayCurrency(c)}
                className={`px-3 py-1.5 rounded-full text-xs tracking-wider transition-all border ${
                  isActive
                    ? 'border-[var(--gold)]/60 bg-[var(--gold)]/10 text-[var(--cream)]'
                    : 'border-[var(--line)] bg-[var(--ink-3)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
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
            {formatMoney(perPersonTotal)}
          </p>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-4">
            estimated total {effectiveCurrency !== 'AUD' && <span className="italic normal-case tracking-normal text-[var(--text-dim)]">· from AUD via ECB</span>}
            {fxFailed && <span className="italic normal-case tracking-normal text-[var(--terracotta)]"> · live rate unavailable</span>}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="surface-card rounded-3xl p-8"
        >
          <p className="eyebrow mb-4">Group · {config.travellers} traveller{config.travellers > 1 ? 's' : ''}</p>
          <p className="font-display text-5xl sm:text-6xl text-[var(--gold)] leading-none tracking-tight">
            {formatMoney(groupTotal)}
          </p>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-wider mt-4">estimated total</p>
        </motion.div>
      </div>

      {/* Budget target status — only when the traveller set a target */}
      {config.budgetPerPerson != null && config.budgetPerPerson > 0 && perPersonTotal > 0 && (() => {
        const targetPP = config.budgetPerPerson;
        const targetTotal = targetPP * config.travellers;
        const diffPct = Math.round(((perPersonTotal - targetPP) / targetPP) * 100);
        const within = Math.abs(diffPct) <= 20;
        const over = diffPct > 20;
        // Hex (not var()) so we can append an alpha channel — `var(--x)40` is invalid CSS.
        const accent = over ? '#F15B4B' : '#1F8A70';
        const headline = within
          ? 'On budget — within ±20% of your target.'
          : over
            ? `Over your target by ${diffPct}%.`
            : `${Math.abs(diffPct)}% under your target — money to spare.`;
        const badge = within ? '✓ Within budget' : over ? '⚠ Over budget' : '✓ Under budget';
        // Track spans 0 → 1.5× the target. Target sits at 66.67%; the ±20%
        // tolerance band runs 53.33%–80%. Estimate fill is capped at the edge.
        const estFill = Math.min(1.5, perPersonTotal / targetPP) / 1.5 * 100;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="surface-card rounded-3xl p-8 mb-10"
            style={{ border: `1px solid ${accent}40` }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <p className="eyebrow" style={{ color: accent }}>Your budget</p>
              <span
                className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full"
                style={{ color: accent, background: `${accent}1A` }}
              >
                {badge}
              </span>
            </div>
            <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-6">
              {headline}
            </h3>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="eyebrow mb-1.5">Target · per person</p>
                <p className="font-display text-3xl text-[var(--cream)] leading-none">{formatMoney(targetPP)}</p>
                <p className="text-[var(--text-dim)] text-[11px] mt-1.5">{formatMoney(targetTotal)} for the trip</p>
              </div>
              <div>
                <p className="eyebrow mb-1.5">Estimated · per person</p>
                <p className="font-display text-3xl leading-none" style={{ color: accent }}>{formatMoney(perPersonTotal)}</p>
                <p className="text-[var(--text-dim)] text-[11px] mt-1.5">{formatMoney(groupTotal)} for the trip</p>
              </div>
            </div>

            {/* Estimate vs target bar */}
            <div className="relative h-3 rounded-full bg-[var(--ink-4)] overflow-hidden">
              {/* ±20% tolerance band */}
              <div
                className="absolute inset-y-0"
                style={{ left: '53.33%', width: '26.67%', background: 'var(--sage)', opacity: 0.2 }}
              />
              {/* estimate fill */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: accent }}
                initial={{ width: 0 }}
                animate={{ width: `${estFill}%` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
              {/* target marker */}
              <div className="absolute inset-y-0 w-[2px] bg-[var(--cream)]" style={{ left: '66.67%' }} />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] uppercase tracking-wider text-[var(--text-dim)]">
              <span>Estimated</span>
              <span>Target ±20%</span>
            </div>
          </motion.div>
        );
      })()}

      {/* Spend visualisation — stacked bar showing where the money lives */}
      {perPersonTotal > 0 && (() => {
        const palette = ['#F15B4B', '#B57C1C', '#1F8A70', '#8E3B3B', '#CE9B45', '#6A6A6E', '#1B1B1B'];
        const segments = budget
          .map((item, i) => ({ category: item.category, mid: parseCostMid(item.cost), colour: palette[i % palette.length] }))
          .filter(s => s.mid > 0)
          .sort((a, b) => b.mid - a.mid);
        const total = segments.reduce((s, x) => s + x.mid, 0);
        if (total === 0) return null;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}
            className="surface-card rounded-3xl p-7 mb-10"
          >
            <p className="eyebrow mb-4">Where it goes</p>
            <div className="flex h-3 w-full rounded-full overflow-hidden bg-[var(--ink-4)] mb-5">
              {segments.map((s, i) => (
                <motion.div
                  key={s.category}
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.mid / total) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
                  style={{ background: s.colour }}
                  title={`${s.category}: ${Math.round((s.mid / total) * 100)}%`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {segments.map((s) => {
                const pct = Math.round((s.mid / total) * 100);
                return (
                  <div key={s.category} className="flex items-center gap-2.5 text-sm">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.colour }} aria-hidden />
                    <span className="text-[var(--text-muted)] flex-1 truncate">{s.category}</span>
                    <span className="text-[var(--cream)] font-medium tabular-nums">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })()}

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
                  <p className="font-display text-2xl text-[var(--gold)] flex-shrink-0">{convertCostString(item.cost)}</p>
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
        // Guard against zero/NaN trip length — would otherwise divide by zero
        // and render Infinity/NaN percentages in the comparison.
        if (!Number.isFinite(avgTotal) || avgTotal <= 0) return null;
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
                    {formatMoney(avgTotal)}
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
                    {formatMoney(perPersonTotal)}
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
              Based on ~{formatMoney(avgDaily)}/day for mid-range Australian travellers · {totalDays} days
            </p>
          </motion.div>
        );
      })()}

      {/* Footprint */}
      {(() => {
        let perPersonCO2 = 0;
        let shortHaulFlight: FlightLeg | null = null;

        for (const f of flights) {
          let km = estimateLegDistance(f.from_code, f.to_code);
          if (km == null && isAirportCode(f.from_code) && isAirportCode(f.to_code)) {
            km = LONG_HAUL_FALLBACK_KM;
          }
          if (km == null) continue;
          perPersonCO2 += flightCO2kg(km);
          if (km > 0 && km < 800 && !shortHaulFlight) shortHaulFlight = f;
        }

        for (const t of transport) {
          const km = estimateLegDistance(t.from, t.to);
          if (km == null) continue;
          perPersonCO2 += transportCO2(t.mode, km);
        }

        if (perPersonCO2 <= 0) return null;

        const groupCO2 = perPersonCO2 * config.travellers;
        const tonnes = perPersonCO2 / 1000;
        const display = tonnes >= 1 ? `${tonnes.toFixed(1)} t` : `${Math.round(perPersonCO2)} kg`;
        const groupTonnes = groupCO2 / 1000;
        const groupDisplay = groupTonnes >= 1 ? `${groupTonnes.toFixed(1)} t` : `${Math.round(groupCO2)} kg`;

        // Static comparison thresholds
        let comparison = '≈ a month of average household electricity';
        if (perPersonCO2 > 500) comparison = '≈ 3 months of average household electricity';
        if (perPersonCO2 > 1000) comparison = '≈ 6 months of average household electricity';
        if (perPersonCO2 > 2000) comparison = '≈ a year of average household electricity';

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="surface-card rounded-3xl p-8 mt-10 border border-[var(--sage)]/30"
          >
            <p className="eyebrow mb-3" style={{ color: 'var(--sage)' }}>Footprint</p>
            <h3 className="font-display text-3xl text-[var(--cream)] leading-tight mb-6">
              The <em className="italic" style={{ color: 'var(--sage)' }}>carbon</em> cost.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="eyebrow mb-2">Per traveller</p>
                <p className="font-display text-5xl leading-none tracking-tight" style={{ color: 'var(--sage)' }}>
                  {display}<span className="text-base text-[var(--text-dim)]"> CO₂e</span>
                </p>
              </div>
              <div>
                <p className="eyebrow mb-2">Group total · {config.travellers} traveller{config.travellers > 1 ? 's' : ''}</p>
                <p className="font-display text-5xl text-[var(--cream)] leading-none tracking-tight">
                  {groupDisplay}<span className="text-base text-[var(--text-dim)]"> CO₂e</span>
                </p>
              </div>
            </div>

            <p className="text-[var(--text-muted)] text-sm font-display italic mb-2">{comparison}</p>

            {shortHaulFlight && (
              <div
                className="mt-5 rounded-2xl px-5 py-4 border"
                style={{ borderColor: 'rgba(122,150,108,0.35)', background: 'rgba(122,150,108,0.08)' }}
              >
                <p className="eyebrow mb-1" style={{ color: 'var(--sage)' }}>Greener option</p>
                <p className="text-[var(--cream)] text-sm leading-relaxed">
                  A train alternative for your <span className="italic">{shortHaulFlight.from_code} → {shortHaulFlight.to_code}</span> leg could cut emissions by around <em className="italic" style={{ color: 'var(--sage)' }}>70%</em>.
                </p>
              </div>
            )}

            <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider mt-5">
              Industry-average factors · 0.115 kg/km flights · 0.041 kg/km rail
            </p>
          </motion.div>
        );
      })()}

      {/* Quick split — for splitting individual bills (restaurants, taxis) */}
      {config.travellers > 1 && (
        <BillSplit travellers={config.travellers} formatMoney={formatMoney} effectiveRate={effectiveRate} symbol={symbol} />
      )}

      <p className="text-[var(--text-dim)] text-[10px] text-center mt-8 tracking-wider uppercase">
        Estimates based on typical Australian traveller costs. Prices vary by season.
      </p>
    </motion.div>
  );
}

function BillSplit({ travellers, formatMoney, effectiveRate, symbol }: { travellers: number; formatMoney: (n: number) => string; effectiveRate: number; symbol: string }) {
  const [amount, setAmount] = useState<string>('');
  const [tipPct, setTipPct] = useState<number>(0);
  const [people, setPeople] = useState<number>(travellers);
  const total = Math.max(0, Number(amount) || 0);
  const withTip = total * (1 + tipPct / 100);
  const perPerson = people > 0 ? withTip / people : 0;
  const safePeople = Math.max(1, people);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}
      className="surface-card rounded-3xl p-7 mt-10"
    >
      <div className="flex items-baseline justify-between mb-4">
        <p className="eyebrow">Quick split</p>
        <span className="text-[10px] text-[var(--text-dim)] tracking-wider uppercase">For shared bills</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div>
          <label className="block text-[10px] tracking-wider uppercase text-[var(--text-dim)] mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{symbol || '$'}</span>
            <input
              type="number" inputMode="decimal" min={0}
              value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 120"
              className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl pl-7 pr-3 py-2.5 text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--terracotta)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-wider uppercase text-[var(--text-dim)] mb-1.5">Tip</label>
          <div className="flex gap-1">
            {[0, 5, 10, 15, 20].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipPct(t)}
                className={`flex-1 px-1 py-2 rounded-lg text-xs transition-all border ${
                  tipPct === t
                    ? 'border-[var(--terracotta)]/50 bg-[var(--terracotta)]/8 text-[var(--cream)]'
                    : 'border-[var(--line)] text-[var(--text-muted)]'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[10px] tracking-wider uppercase text-[var(--text-dim)] mb-1.5">People</label>
          <div className="flex items-center gap-2 bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-3 py-1.5">
            <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} className="w-7 h-7 rounded-full bg-[var(--ink-4)] text-[var(--cream)] text-base">−</button>
            <span className="font-display text-xl text-[var(--cream)] flex-1 text-center tabular-nums">{people}</span>
            <button type="button" onClick={() => setPeople(Math.min(20, people + 1))} className="w-7 h-7 rounded-full bg-[var(--ink-4)] text-[var(--cream)] text-base">+</button>
          </div>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-4 pt-5 border-t border-[var(--line)]">
        <div>
          <p className="text-[10px] tracking-wider uppercase text-[var(--text-dim)] mb-1">Per person</p>
          <p className="font-display text-4xl text-[var(--terracotta)] leading-none tabular-nums">{formatMoney(perPerson / effectiveRate)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] tracking-wider uppercase text-[var(--text-dim)] mb-1">Total {tipPct > 0 ? `(incl. ${tipPct}%)` : ''}</p>
          <p className="font-display text-2xl text-[var(--cream)] leading-none tabular-nums">{formatMoney(withTip / effectiveRate)}</p>
          <p className="text-[10px] tracking-wider uppercase text-[var(--text-dim)] mt-1">across {safePeople} {safePeople === 1 ? 'person' : 'people'}</p>
        </div>
      </div>
    </motion.div>
  );
}
