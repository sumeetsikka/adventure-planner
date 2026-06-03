/**
 * Trust layer — honest "this is an AI estimate" markers.
 *
 * Everything in the app is LLM-generated, not pulled from a live booking/price
 * feed. Rather than hide that, we surface it: a small badge on estimate-heavy
 * surfaces and a one-line footnote per tab. Honesty builds trust — the user
 * knows to verify the exact price/availability on the booking site (whose
 * deep-links we already provide) before committing.
 */

/** Inline pill — drop next to a price or a recommendation. */
export function EstimateBadge({ label = 'AI estimate', title }: { label?: string; title?: string }) {
  return (
    <span
      title={title || 'AI-generated estimate — confirm exact price & availability on the booking site before you book.'}
      className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-[var(--ink-4)] text-[var(--text-muted)] border border-[var(--line)] align-middle"
    >
      <span aria-hidden>✦</span>{label}
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
