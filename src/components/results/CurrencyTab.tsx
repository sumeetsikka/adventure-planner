import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { CurrencyInfo } from '../../types';
import { fetchRate } from '../../lib/fx';
import { getPhrases, type Phrase } from '../../lib/phrases';

interface Props {
  currency: CurrencyInfo | null;
  country?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function suggestedTipPct(culture: string | undefined): number {
  if (!culture) return 10;
  const c = culture.toLowerCase();
  if (c.includes('not expected') || c.includes('not customary') || c.includes('no tipping') || c.includes('included')) {
    return 0;
  }
  if (/10\s*[-–]\s*15/.test(c) || /10\s*to\s*15/.test(c)) return 12;
  if (/15\s*[-–]\s*20/.test(c) || /15\s*to\s*20/.test(c)) return 18;
  if (/18\s*[-–]\s*20/.test(c)) return 18;
  if (c.includes('5%')) return 5;
  if (c.includes('20%')) return 20;
  if (c.includes('15%')) return 15;
  if (c.includes('10%')) return 10;
  return 10;
}

export default function CurrencyTab({ currency, country }: Props) {
  const [audAmount, setAudAmount] = useState<number>(100);
  const [localAmount, setLocalAmount] = useState<number | null>(null);

  // Live FX
  const [liveRate, setLiveRate] = useState<number | null>(null);
  const [rateFetchedAt, setRateFetchedAt] = useState<number | null>(null);
  const [fxLoading, setFxLoading] = useState<boolean>(false);

  // Bill splitter
  const [billAmount, setBillAmount] = useState<number>(0);
  const [people, setPeople] = useState<number>(2);
  const [tipPct, setTipPct] = useState<number>(10);
  const [tipInitialised, setTipInitialised] = useState(false);

  // Phrases
  const [openSection, setOpenSection] = useState<string | null>('hello');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const quoteCode = currency?.currency_code;

  useEffect(() => {
    if (!quoteCode) return;
    let cancelled = false;
    // Side-effect for an async fetch lifecycle — toggling a loading flag
    // synchronously here is the intended pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFxLoading(true);
    fetchRate('AUD', quoteCode).then((r) => {
      if (cancelled) return;
      if (r !== null) {
        setLiveRate(r);
        setRateFetchedAt(Date.now());
      }
      setFxLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [quoteCode]);

  // Default tip from culture text — only on first load.
  useEffect(() => {
    if (!currency || tipInitialised) return;
    // Initial-derivation pattern: we need `currency` to compute the suggested
    // tip and can only do so once it's available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTipPct(suggestedTipPct(currency.tipping_culture));
    setTipInitialised(true);
  }, [currency, tipInitialised]);

  const phrasePack = useMemo(() => (country ? getPhrases(country) : null), [country]);

  if (!currency) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Money</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">
          Tallying <span className="text-[var(--gold)]">exchange</span>…
        </p>
      </div>
    );
  }

  const fallbackRate = currency.rate_to_aud;
  const rate = liveRate ?? fallbackRate;
  const isLive = liveRate !== null;

  const displayLocal =
    localAmount !== null ? localAmount : Math.round(audAmount * rate * 100) / 100;

  function handleAudChange(val: string) {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setAudAmount(0);
      setLocalAmount(null);
      return;
    }
    setAudAmount(num);
    setLocalAmount(null);
  }

  function handleLocalChange(val: string) {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setLocalAmount(0);
      return;
    }
    setLocalAmount(num);
    setAudAmount(Math.round((num / rate) * 100) / 100);
  }

  // Bill split calcs
  const safePeople = Math.max(1, people || 1);
  const tipAmount = billAmount * (tipPct / 100);
  const billTotal = billAmount + tipAmount;
  const perPersonLocal = billTotal / safePeople;
  const perPersonAud = rate > 0 ? perPersonLocal / rate : 0;

  const tipChips = [0, 5, 10, 15, 18, 20];

  const infoCards = [
    { label: 'Tipping Culture', text: currency.tipping_culture },
    { label: 'Cash vs Card', text: currency.cash_vs_card },
    { label: 'ATM Tips', text: currency.atm_tips },
  ];

  async function copyPhrase(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((c) => (c === key ? null : c)), 1400);
    } catch {
      /* clipboard unavailable */
    }
  }

  const phraseSections: { key: keyof NonNullable<typeof phrasePack> & string; label: string }[] = [
    { key: 'hello', label: 'Greetings' },
    { key: 'food', label: 'At the table' },
    { key: 'navigation', label: 'Getting around' },
    { key: 'emergency', label: 'In an emergency' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter III — Currency</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          The <span className="italic text-[var(--gold)]">{currency.currency_name}</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm">
          {currency.currency_code} ·{' '}
          {isLive && rateFetchedAt
            ? `ECB live · ${formatTime(rateFetchedAt)}`
            : fxLoading
              ? 'Fetching live rate…'
              : 'Estimated rate'}
        </p>
      </div>

      {/* Live converter hero */}
      <div className="surface-card rounded-3xl p-8 sm:p-10 mb-6">
        <div className="text-center mb-6">
          <p className="eyebrow mb-3">Live exchange</p>
          <p className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-none">
            1 <span className="text-[var(--text-muted)]">AUD</span>{' '}
            <span className="italic text-[var(--gold)]">=</span>{' '}
            {currency.symbol}
            {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}{' '}
            <span className="text-[var(--text-muted)] text-2xl">{currency.currency_code}</span>
          </p>
          <p className="eyebrow mt-3 text-[var(--text-dim)]">
            {isLive && rateFetchedAt
              ? `ECB live · ${formatTime(rateFetchedAt)}`
              : fxLoading
                ? 'Loading…'
                : 'Estimated'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full">
            <label className="eyebrow block mb-2">AUD</label>
            <div className="flex items-center gap-2 rounded-full bg-[var(--ink-4)] border border-[var(--line)] px-5 py-3 focus-within:border-[var(--gold)]/50 transition-colors">
              <span className="text-[var(--text-muted)] font-display">A$</span>
              <input
                type="number"
                min="0"
                value={audAmount}
                onChange={(e) => handleAudChange(e.target.value)}
                className="bg-transparent text-[var(--cream)] font-display text-xl w-full outline-none"
                placeholder="100"
              />
            </div>
          </div>

          <div className="text-[var(--gold)] text-2xl font-display italic sm:mt-7">⇌</div>

          <div className="w-full">
            <label className="eyebrow block mb-2">{currency.currency_code}</label>
            <div className="flex items-center gap-2 rounded-full bg-[var(--ink-4)] border border-[var(--line)] px-5 py-3 focus-within:border-[var(--gold)]/50 transition-colors">
              <span className="text-[var(--text-muted)] font-display">{currency.symbol}</span>
              <input
                type="number"
                min="0"
                value={displayLocal}
                onChange={(e) => handleLocalChange(e.target.value)}
                className="bg-transparent text-[var(--cream)] font-display text-xl w-full outline-none"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bill splitter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        className="surface-soft rounded-3xl p-7 mb-6"
      >
        <p className="eyebrow mb-5">Splitting the bill</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="eyebrow block mb-2">Bill ({currency.currency_code})</label>
            <div className="flex items-center gap-2 rounded-full bg-[var(--ink-4)] border border-[var(--line)] px-5 py-3 focus-within:border-[var(--gold)]/50 transition-colors">
              <span className="text-[var(--text-muted)] font-display">{currency.symbol}</span>
              <input
                type="number"
                min="0"
                value={billAmount || ''}
                onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                className="bg-transparent text-[var(--cream)] font-display text-xl w-full outline-none"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="eyebrow block mb-2">People</label>
            <div className="flex items-center gap-2 rounded-full bg-[var(--ink-4)] border border-[var(--line)] px-5 py-3 focus-within:border-[var(--gold)]/50 transition-colors">
              <span className="text-[var(--text-muted)] font-display">×</span>
              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-transparent text-[var(--cream)] font-display text-xl w-full outline-none"
                placeholder="2"
              />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <p className="eyebrow mb-3">Tip</p>
          <div className="flex flex-wrap gap-2">
            {tipChips.map((pct) => {
              const active = pct === tipPct;
              return (
                <button
                  key={pct}
                  onClick={() => setTipPct(pct)}
                  className={`text-[12px] tracking-widest uppercase rounded-full px-4 py-2 border transition-all ${
                    active
                      ? 'bg-[var(--gold-soft)] border-[var(--gold)] text-[var(--ink)]'
                      : 'border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                  }`}
                >
                  {pct}%
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--line)]">
          <div>
            <p className="eyebrow mb-1">Tip</p>
            <p className="font-display text-2xl text-[var(--cream)]">
              {currency.symbol}
              {tipAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-1">Total</p>
            <p className="font-display text-2xl text-[var(--cream)]">
              {currency.symbol}
              {billTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="eyebrow mb-1">Per person</p>
            <p className="font-display text-2xl text-[var(--gold)]">
              {currency.symbol}
              {perPersonLocal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[var(--text-dim)] text-[11px] mt-1 tracking-wider uppercase">
              A${perPersonAud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Phrases */}
      {phrasePack && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
          className="surface-soft rounded-3xl p-7 mb-8"
        >
          <div className="flex items-baseline justify-between mb-1">
            <p className="eyebrow">Essential phrases</p>
            <p className="text-[var(--text-dim)] text-[11px] tracking-wider uppercase">
              {phrasePack.language}
            </p>
          </div>
          <div className="divider my-4 max-w-[80px]" />

          <div className="flex flex-col gap-3">
            {phraseSections.map((section) => {
              const phrases = phrasePack[section.key] as Phrase[];
              const isOpen = openSection === section.key;
              return (
                <div key={section.key} className="border-b border-[var(--line)] pb-3 last:border-b-0">
                  <button
                    onClick={() => setOpenSection(isOpen ? null : section.key)}
                    className="w-full flex items-center justify-between py-2 text-left"
                  >
                    <span className="eyebrow">{section.label}</span>
                    <span className={`text-[var(--gold)] font-display italic transition-transform ${isOpen ? 'rotate-90' : ''}`}>
                      ›
                    </span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="flex flex-col gap-3 mt-2"
                    >
                      {phrases.map((p, i) => {
                        const k = `${section.key}-${i}`;
                        const copied = copiedKey === k;
                        return (
                          <div
                            key={k}
                            className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--ink-4)] border border-[var(--line)] px-4 py-3"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-[var(--text-muted)] text-[12px] tracking-wide uppercase">
                                {p.english}
                              </p>
                              <p className="font-display italic text-[var(--cream)] text-lg leading-tight">
                                {p.local}
                              </p>
                              {p.pronunciation && (
                                <p className="text-[var(--gold)] text-[11px] mt-0.5 tracking-wider">
                                  {p.pronunciation}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => copyPhrase(p.local, k)}
                              className={`shrink-0 text-[10px] tracking-widest uppercase rounded-full px-3 py-1.5 border transition-all ${
                                copied
                                  ? 'border-[var(--gold)] text-[var(--gold)]'
                                  : 'border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--line-strong)] hover:text-[var(--cream)]'
                              }`}
                            >
                              {copied ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Info trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {infoCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
            className="surface-soft rounded-3xl p-6"
          >
            <p className="eyebrow mb-3">{card.label}</p>
            <p className="text-[var(--cream)] text-[14px] leading-relaxed font-display-soft">{card.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Common costs */}
      {currency.common_costs.length > 0 && (
        <div>
          <p className="eyebrow mb-4">Common Costs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currency.common_costs.map((cost, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-4 border-b border-[var(--line)]"
              >
                <span className="text-[var(--cream)] text-[15px] font-display-soft italic">{cost.item}</span>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-display text-xl text-[var(--cream)] leading-none">
                    {currency.symbol}{cost.local_price}
                  </p>
                  <p className="text-[var(--text-dim)] text-[11px] mt-1 tracking-wider uppercase">A${cost.aud_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
