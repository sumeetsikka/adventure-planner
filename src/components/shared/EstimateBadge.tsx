/**
 * Trust layer — per-field provenance.
 *
 * Because this app generates almost everything, it can do the one thing no OTA
 * and no AI startup wants to: say which numbers are real. Three sources, three
 * markers, used consistently:
 *
 *   VERIFIED  — came from a real feed (Google Places, Open-Meteo, ECB)
 *   ESTIMATED — the model's guess (prices, durations, most descriptive text)
 *   YOURS     — the traveller entered it (wallet, expenses, manual edits)
 *
 * The specific failure this prevents: a Do/Taste card shows a Google rating
 * badged "Live" directly above an invented price. Without a marker on the price,
 * the Live badge implicitly vouches for the whole card. Marking the estimate is
 * what keeps the verified badge meaningful.
 *
 * `compact` renders a bare "est." for sitting beside a number; the default pill
 * is for detail panels and headers where there's room.
 */

/** Inline marker — drop next to a price or a recommendation. */
export function EstimateBadge({
  label = 'AI estimate',
  title,
  compact = false,
}: { label?: string; title?: string; compact?: boolean }) {
  const tip = title || 'AI-generated estimate — confirm exact price & availability on the booking site before you book.';
  if (compact) {
    return (
      <span
        title={tip}
        className="text-[10px] font-medium tracking-wide text-[var(--text-dim)] align-middle cursor-help"
      >
        est.
      </span>
    );
  }
  return (
    <span
      title={tip}
      className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-[var(--ink-4)] text-[var(--text-muted)] border border-[var(--line)] align-middle"
    >
      <span aria-hidden>✦</span>{label}
    </span>
  );
}

/** Real data from a named feed. The counterpart to EstimateBadge. */
export function VerifiedBadge({ source, compact = false }: { source: string; compact?: boolean }) {
  const tip = `Verified — real data from ${source}, not an AI estimate.`;
  if (compact) {
    return (
      <span title={tip} className="text-[10px] font-medium tracking-wide align-middle cursor-help" style={{ color: 'var(--sage)' }}>
        verified
      </span>
    );
  }
  return (
    <span
      title={tip}
      className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full align-middle"
      style={{ background: 'color-mix(in srgb, var(--sage) 14%, transparent)', color: 'var(--sage)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sage)' }} aria-hidden />
      Verified
    </span>
  );
}

/** The traveller's own data — never generated, never sent anywhere. */
export function YoursBadge({ compact = false }: { compact?: boolean }) {
  const tip = 'You entered this — stored on this device only.';
  if (compact) {
    return (
      <span title={tip} className="text-[10px] font-medium tracking-wide text-[var(--gold)] align-middle cursor-help">
        yours
      </span>
    );
  }
  return (
    <span
      title={tip}
      className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full align-middle"
      style={{ background: 'color-mix(in srgb, var(--gold) 14%, transparent)', color: 'var(--gold)' }}
    >
      <span aria-hidden>✎</span>Yours
    </span>
  );
}

/** Full-width footnote — place at the bottom of an estimate-heavy tab. */
export function EstimateNote({ what = 'prices and details' }: { what?: string }) {
  return (
    <p className="text-[var(--text-dim)] text-[11px] leading-relaxed mt-6 flex items-start gap-2">
      <span aria-hidden className="mt-0.5">ℹ️</span>
      <span>
        These {what} are AI-generated estimates to help you plan, not live quotes.
        Always confirm the exact price, availability and details on the booking
        site before you book.
      </span>
    </p>
  );
}
