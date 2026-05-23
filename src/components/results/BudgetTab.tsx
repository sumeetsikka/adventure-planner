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
    const v = audAmount * effectiveRate;
    // JPY has no decimals; INR/most others render as integers for clean editorial look.
    const rounded = effectiveCurrency === 'JPY' ? Math.round(v) : Math.round(v);
    return `${symbol}${rounded.toLocaleString()}`;
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

      <p className="text-[var(--text-dim)] text-[10px] text-center mt-8 tracking-wider uppercase">
        Estimates based on typical Australian traveller costs. Prices vary by season.
      </p>
    </motion.div>
  );
}
