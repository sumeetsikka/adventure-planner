import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Destination, DestinationInfo } from '../../types';
import { getDestinationInfo } from '../../lib/api';
import { useWikiImage } from '../../lib/useWikiImage';

interface Props {
  destination: Destination;
  countryName: string;
  selected: boolean;
  onToggleSelect: () => void;
  onClose: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen "Know more" panel for a destination.
 * Fetches a rich synopsis on open (top things to do, food, tips, etc.) and
 * presents it in an editorial layout. Falls back to the static `brief` if the
 * LLM call fails.
 */
export default function DestinationDetail({
  destination: d, countryName, selected, onToggleSelect, onClose,
}: Props) {
  const photo = useWikiImage(d.name, 'destination');
  const [info, setInfo] = useState<DestinationInfo | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getDestinationInfo(d.name, countryName)
      .then((res) => {
        if (cancelled) return;
        // Treat an empty things_to_do as a soft failure → fall back to brief.
        if (!res || (res.things_to_do.length === 0 && !res.famous_for)) {
          setStatus('error');
        } else {
          setInfo(res);
          setStatus('ready');
        }
      })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [d.name, countryName]);

  // Body-scroll lock + Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[280] bg-[var(--ink)]/95 backdrop-blur-md overflow-y-auto print:hidden"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`About ${d.name}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-3xl mx-auto min-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Hero */}
          <div className="relative h-64 sm:h-80 overflow-hidden" style={{ background: `linear-gradient(150deg, ${d.colour}66, var(--ink-2))` }}>
            {photo && (
              <img
                src={photo}
                alt={d.name}
                className="absolute inset-0 w-full h-full object-cover opacity-80 animate-ken-burns"
                onError={(e) => {
                  const i = e.currentTarget;
                  if (i.dataset.fell) { i.style.display = 'none'; return; }
                  i.dataset.fell = '1';
                  i.src = `https://picsum.photos/seed/${encodeURIComponent(d.id)}/1200/600`;
                }}
              />
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.4) 0%, rgba(10,8,6,0.5) 50%, var(--ink) 100%)' }} />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-[var(--ink)]/70 backdrop-blur border border-[var(--line-strong)] text-[var(--cream)] text-2xl leading-none flex items-center justify-center hover:bg-[var(--ink)] transition-colors"
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="eyebrow mb-2" style={{ color: 'var(--gold-soft)' }}>{d.region}</p>
              <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05]">
                {d.emoji} {d.name}
              </h2>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-32 pt-8">
            {status === 'loading' && (
              <div className="text-center py-16">
                <div className="w-7 h-7 border border-[var(--text-dim)] border-t-[var(--gold)] rounded-full animate-spin mx-auto mb-4" />
                <p className="eyebrow text-[var(--text-muted)]">Researching {d.name}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="surface-soft rounded-2xl p-7">
                <p className="eyebrow mb-3">Overview</p>
                <p className="font-display-soft text-[var(--cream)] text-[15px] leading-relaxed">{d.brief}</p>
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {d.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--text-muted)]">{t}</span>
                  ))}
                </div>
                <p className="text-[var(--text-dim)] text-xs mt-5 italic">Couldn't load the full synopsis — showing the summary.</p>
              </div>
            )}

            {status === 'ready' && info && (
              <div className="space-y-9">
                {/* Famous for + vibe */}
                <section>
                  <p className="eyebrow mb-3">Famous for</p>
                  <p className="font-display text-2xl sm:text-3xl text-[var(--cream)] leading-snug italic">
                    {info.famous_for}
                  </p>
                  {info.vibe && (
                    <p className="text-[var(--text-muted)] text-sm mt-3 font-light">{info.vibe}</p>
                  )}
                </section>

                {/* Quick facts */}
                <section className="grid grid-cols-2 gap-3">
                  <div className="surface-soft rounded-2xl p-4">
                    <p className="eyebrow text-[var(--text-dim)] mb-1.5">Best time</p>
                    <p className="text-[var(--cream)] text-sm leading-snug">{info.best_time || '—'}</p>
                  </div>
                  <div className="surface-soft rounded-2xl p-4">
                    <p className="eyebrow text-[var(--text-dim)] mb-1.5">Ideal stay</p>
                    <p className="text-[var(--cream)] text-sm leading-snug">{info.ideal_duration || `${d.recommendedDays[0]}–${d.recommendedDays[1]} days`}</p>
                  </div>
                </section>

                {/* Things to do */}
                {info.things_to_do.length > 0 && (
                  <section>
                    <div className="flex items-baseline gap-4 mb-4">
                      <p className="eyebrow">Top things to do</p>
                      <div className="flex-1 h-px bg-[var(--line)]" />
                    </div>
                    <ol className="space-y-2.5">
                      {info.things_to_do.map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="font-display text-xl text-[var(--gold)] leading-none w-7 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-[var(--text)] text-[15px] leading-relaxed pt-0.5">{item}</p>
                        </li>
                      ))}
                    </ol>
                  </section>
                )}

                {/* Food */}
                {info.food_highlights.length > 0 && (
                  <section>
                    <div className="flex items-baseline gap-4 mb-4">
                      <p className="eyebrow">Eat this</p>
                      <div className="flex-1 h-px bg-[var(--line)]" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {info.food_highlights.map((f, i) => (
                        <span key={i} className="surface-soft rounded-full px-4 py-2 text-[13px] text-[var(--cream)] font-display-soft italic">
                          {f}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {/* Good to know */}
                {info.good_to_know.length > 0 && (
                  <section>
                    <div className="flex items-baseline gap-4 mb-4">
                      <p className="eyebrow">Good to know</p>
                      <div className="flex-1 h-px bg-[var(--line)]" />
                    </div>
                    <ul className="space-y-2">
                      {info.good_to_know.map((tip, i) => (
                        <li key={i} className="surface-soft rounded-2xl px-4 py-3 flex gap-3">
                          <span className="text-[var(--gold)] text-sm leading-none mt-0.5">✦</span>
                          <p className="text-[var(--text-muted)] text-[13.5px] leading-relaxed">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}
          </div>

          {/* Sticky action bar */}
          <div
            className="fixed bottom-0 left-0 right-0 z-10"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="max-w-3xl mx-auto px-6 sm:px-8 py-4" style={{ background: 'linear-gradient(180deg, transparent, var(--ink) 40%)' }}>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-3.5 rounded-full text-sm border border-[var(--line-strong)] text-[var(--cream)] hover:bg-[var(--ink-3)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => { onToggleSelect(); onClose(); }}
                  className={`flex-1 px-6 py-3.5 rounded-full font-medium text-sm transition-colors ${
                    selected
                      ? 'bg-[var(--ink-3)] text-[var(--cream)] border border-[var(--gold)]/40'
                      : 'bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)]'
                  }`}
                >
                  {selected ? '✓ In your itinerary — remove' : 'Add to my itinerary →'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
