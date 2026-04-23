import { useState } from 'react';
import type { CurrencyInfo } from '../../types';

interface Props {
  currency: CurrencyInfo | null;
}

export default function CurrencyTab({ currency }: Props) {
  const [audAmount, setAudAmount] = useState<number>(100);
  const [localAmount, setLocalAmount] = useState<number | null>(null);

  if (!currency) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">💱</span>
        <p className="text-[var(--cream)] font-medium">Currency information is loading</p>
      </div>
    );
  }

  const rate = currency.rate_to_aud;

  const displayLocal =
    localAmount !== null
      ? localAmount
      : Math.round(audAmount * rate * 100) / 100;

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
    { icon: '🤝', label: 'Tipping Culture', text: currency.tipping_culture },
    { icon: '💳', label: 'Cash vs Card', text: currency.cash_vs_card },
    { icon: '🏧', label: 'ATM Tips', text: currency.atm_tips },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Currency Guide</h2>
        <p className="text-[var(--text-muted)] text-sm">{currency.currency_name} ({currency.currency_code})</p>
      </div>

      {/* Exchange rate card */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-6 mb-4">
        <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-2">Current Rate</p>
        <p className="text-[var(--cream)] text-3xl font-bold">
          1 AUD{' '}
          <span className="text-[var(--text-muted)] font-normal">=</span>{' '}
          <span className="text-[#7A9082]">
            {currency.symbol}{rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>{' '}
          <span className="text-xl text-[var(--text-muted)]">{currency.currency_code}</span>
        </p>
      </div>

      {/* Converter widget */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-5 mb-4">
        <p className="text-[var(--cream)] font-semibold text-sm mb-4">Currency Converter</p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full">
            <label className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider block mb-1.5">AUD</label>
            <div className="flex items-center gap-2 rounded-xl bg-[var(--ink-3)] border border-[var(--line)] px-3 py-2.5 focus-within:border-white/25 transition-colors">
              <span className="text-[var(--text-muted)] text-sm font-medium">A$</span>
              <input
                type="number"
                min="0"
                value={audAmount}
                onChange={(e) => handleAudChange(e.target.value)}
                className="bg-transparent text-[var(--cream)] text-sm font-bold w-full outline-none placeholder-gray-600"
                placeholder="100"
              />
            </div>
          </div>

          <div className="text-[var(--text-muted)] text-xl sm:mt-5 rotate-90 sm:rotate-0">⇄</div>

          <div className="w-full">
            <label className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider block mb-1.5">
              {currency.currency_code}
            </label>
            <div className="flex items-center gap-2 rounded-xl bg-[var(--ink-3)] border border-[var(--line)] px-3 py-2.5 focus-within:border-white/25 transition-colors">
              <span className="text-[var(--text-muted)] text-sm font-medium">{currency.symbol}</span>
              <input
                type="number"
                min="0"
                value={displayLocal}
                onChange={(e) => handleLocalChange(e.target.value)}
                className="bg-transparent text-[var(--cream)] text-sm font-bold w-full outline-none placeholder-gray-600"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {infoCards.map((card, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-4 hover:border-[var(--line-strong)] hover:bg-[var(--ink-4)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <span className="text-2xl block mb-2">{card.icon}</span>
            <p className="text-[var(--cream)] font-semibold text-xs mb-1.5">{card.label}</p>
            <p className="text-[var(--text-muted)] text-[12px] leading-relaxed">{card.text}</p>
          </div>
        ))}
      </div>

      {/* Common costs */}
      {currency.common_costs.length > 0 && (
        <div>
          <h3 className="text-[var(--cream)] font-bold text-sm mb-3">Common Costs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {currency.common_costs.map((cost, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] px-4 py-3 flex items-center justify-between hover:border-[var(--line-strong)] hover:bg-[var(--ink-4)] transition-all duration-300"
              >
                <span className="text-gray-300 text-sm">{cost.item}</span>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[var(--cream)] text-sm font-bold">{currency.symbol}{cost.local_price}</p>
                  <p className="text-[var(--text-dim)] text-[10px]">A${cost.aud_price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
