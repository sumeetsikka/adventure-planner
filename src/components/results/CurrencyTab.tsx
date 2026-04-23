import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CurrencyInfo } from '../../types';

interface Props {
  currency: CurrencyInfo | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CurrencyTab({ currency }: Props) {
  const [audAmount, setAudAmount] = useState<number>(100);
  const [localAmount, setLocalAmount] = useState<number | null>(null);

  if (!currency) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Money</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Tallying <span className="text-[var(--gold)]">exchange</span>…</p>
      </div>
    );
  }

  const rate = currency.rate_to_aud;
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

  const infoCards = [
    { label: 'Tipping Culture', text: currency.tipping_culture },
    { label: 'Cash vs Card', text: currency.cash_vs_card },
    { label: 'ATM Tips', text: currency.atm_tips },
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
        <p className="text-[var(--text-muted)] text-sm">{currency.currency_code} · Current market rate</p>
      </div>

      {/* Exchange rate hero */}
      <div className="surface-card rounded-3xl p-10 mb-6 text-center">
        <p className="eyebrow mb-5">Exchange Rate</p>
        <p className="font-display text-5xl sm:text-6xl text-[var(--cream)] leading-none">
          1 <span className="text-[var(--text-muted)]">AUD</span>
        </p>
        <p className="font-display italic text-2xl text-[var(--gold)] my-4">=</p>
        <p className="font-display text-5xl sm:text-6xl text-[var(--cream)] leading-none">
          {currency.symbol}
          {rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <p className="eyebrow mt-4">{currency.currency_code}</p>
      </div>

      {/* Converter */}
      <div className="surface-soft rounded-3xl p-7 mb-6">
        <p className="eyebrow mb-5">Converter</p>
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
