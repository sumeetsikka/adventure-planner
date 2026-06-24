import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TravelConfig } from '../../types';
import { getActiveTripId } from '../../lib/tripStore';
import {
  listWallet, addWalletItem, removeWalletItem, maskValue, isSensitive,
  passportExpiryWarning, WALLET_TYPES,
  type WalletItem, type WalletItemType,
} from '../../lib/travelWallet';

/**
 * Travel wallet — offline document vault. Add/edit/remove passports, insurance,
 * frequent-flyer & confirmation numbers, notes. Sensitive values are masked by
 * default with a per-item reveal. Device-only; the UI says so loudly.
 */

interface Props {
  config: TravelConfig;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function WalletTab({ config }: Props) {
  const tripId = getActiveTripId() || 'default';
  const [items, setItems] = useState<WalletItem[]>(() => listWallet(tripId));
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);

  // Add-form state
  const [type, setType] = useState<WalletItemType>('passport');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [detail, setDetail] = useState('');

  const refresh = () => setItems(listWallet(tripId));

  const submit = () => {
    if (!label.trim() || !value.trim()) return;
    addWalletItem(tripId, { type, label: label.trim(), value: value.trim(), detail: detail.trim() || undefined });
    refresh();
    setLabel(''); setValue(''); setDetail(''); setAdding(false);
  };

  const remove = (id: string) => {
    removeWalletItem(tripId, id);
    const next = { ...revealed }; delete next[id]; setRevealed(next);
    refresh();
  };

  const meta = (t: WalletItemType) => WALLET_TYPES.find((w) => w.id === t) || WALLET_TYPES[4];
  const detailPlaceholder: Record<WalletItemType, string> = {
    passport: 'Expiry date (YYYY-MM-DD)',
    insurance: 'Provider 24h emergency phone',
    'frequent-flyer': 'Airline / alliance',
    confirmation: 'Hotel / airline / what it\'s for',
    note: 'Anything to remember',
  };
  const valuePlaceholder: Record<WalletItemType, string> = {
    passport: 'Passport number',
    insurance: 'Policy number',
    'frequent-flyer': 'Membership number',
    confirmation: 'Confirmation / PNR code',
    note: 'The note',
  };
  const labelPlaceholder: Record<WalletItemType, string> = {
    passport: 'Whose passport? (name)',
    insurance: 'Provider name',
    'frequent-flyer': 'Whose? (name)',
    confirmation: 'What booking?',
    note: 'Title',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-6">
        <p className="eyebrow mb-3">Documents · on this device only</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">wallet</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">
          Passport numbers, insurance, frequent-flyer & confirmation codes — one tap away at check-in, even offline.
        </p>
      </div>

      {/* Privacy banner */}
      <div className="surface-soft rounded-2xl px-4 py-3 mb-6 flex items-start gap-2.5">
        <span aria-hidden className="mt-0.5">🔒</span>
        <p className="text-[var(--text-muted)] text-[12px] leading-relaxed">
          Saved only on this device — never uploaded to any server or shared with the AI. Clearing your browser data erases it.
          Don't use a shared/public device for sensitive numbers.
        </p>
      </div>

      {/* Items grouped by type */}
      {items.length > 0 && (
        <div className="space-y-2.5 mb-6">
          {items.map((it) => {
            const m = meta(it.type);
            const sensitive = isSensitive(it.type);
            const show = revealed[it.id];
            const warn = passportExpiryWarning(it, config.returnDate);
            return (
              <div key={it.id} className="surface-card rounded-2xl p-4 flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5 flex-shrink-0" aria-hidden>{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="text-[var(--cream)] text-sm font-medium">{it.label}</p>
                    <span className="text-[10px] tracking-wider uppercase text-[var(--text-dim)]">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="font-display text-lg text-[var(--cream)] tabular-nums break-all">
                      {sensitive && !show ? maskValue(it.value) : it.value}
                    </p>
                    {sensitive && (
                      <button
                        onClick={() => setRevealed((r) => ({ ...r, [it.id]: !r[it.id] }))}
                        className="text-[10px] tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--cream)] border border-[var(--line)] rounded-full px-2 py-0.5 flex-shrink-0"
                      >
                        {show ? 'Hide' : 'Show'}
                      </button>
                    )}
                  </div>
                  {it.detail && (
                    <p className="text-[var(--text-muted)] text-xs mt-1">{it.detail}</p>
                  )}
                  {warn && (
                    <p
                      className="text-[11px] mt-1.5 leading-snug"
                      style={{ color: warn.level === 'ok' ? 'var(--sage)' : warn.level === 'risk' ? 'var(--gold)' : 'var(--terracotta)' }}
                    >
                      {warn.level === 'ok' ? '✓' : '⚠'} {warn.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => remove(it.id)}
                  aria-label={`Remove ${it.label}`}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta)]/10 transition-colors text-sm flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add form */}
      {adding ? (
        <div className="surface-card rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {WALLET_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] transition-all border ${
                  type === t.id
                    ? 'border-[var(--terracotta)]/50 bg-[var(--terracotta)]/8 text-[var(--cream)]'
                    : 'border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--cream)]'
                }`}
              >
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
          <input
            type="text" value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder={labelPlaceholder[type]}
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--terracotta)] placeholder:text-[var(--text-dim)]"
          />
          <input
            type="text" value={value} onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={valuePlaceholder[type]}
            autoComplete="off"
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--terracotta)] placeholder:text-[var(--text-dim)]"
          />
          <input
            type={type === 'passport' ? 'date' : 'text'}
            value={detail} onChange={(e) => setDetail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={detailPlaceholder[type]}
            className="w-full bg-[var(--ink-3)] border border-[var(--line)] rounded-xl px-3.5 py-2.5 text-[var(--cream)] text-sm focus:outline-none focus:border-[var(--terracotta)] placeholder:text-[var(--text-dim)]"
          />
          <div className="flex gap-2">
            <button
              type="button" onClick={submit} disabled={!label.trim() || !value.trim()}
              className="px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--terracotta)] text-white hover:bg-[var(--terracotta-soft)] transition-colors disabled:opacity-40"
            >
              Save
            </button>
            <button
              type="button" onClick={() => { setAdding(false); setLabel(''); setValue(''); setDetail(''); }}
              className="px-5 py-2.5 rounded-full text-sm font-medium border border-[var(--line-strong)] text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full surface-soft rounded-2xl py-4 text-sm font-medium text-[var(--cream)] hover:bg-[var(--ink-4)] transition-colors border border-dashed border-[var(--line-strong)]"
        >
          ＋ Add a document
        </button>
      )}

      {items.length === 0 && !adding && (
        <p className="text-[var(--text-dim)] text-[11px] text-center mt-6">
          Nothing saved yet. Add your passport, insurance policy, or a booking confirmation to keep it handy on the road.
        </p>
      )}
    </motion.div>
  );
}
