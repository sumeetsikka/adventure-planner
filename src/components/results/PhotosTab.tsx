import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Destination } from '../../types';
import { getDestinationPhotoStrip } from '../../lib/imagery';

interface Props {
  destinations: Destination[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PhotosTab({ destinations }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter VI — Portraits</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          A visual <span className="italic text-[var(--gold)]">preview</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">
          Three scenes from each place you&apos;re bound for.
        </p>
      </div>

      <div className="space-y-12">
        {destinations.map((d, i) => (
          <DestinationStrip key={d.id} destination={d} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function DestinationStrip({ destination: d, index }: { destination: Destination; index: number }) {
  const [photos] = useState(() => getDestinationPhotoStrip(d.name, 1200, 800));
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const markFailed = (i: number) => {
    setFailed((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  const visiblePhotos = photos.filter((_, i) => !failed.has(i));
  const allFailed = visiblePhotos.length === 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 + index * 0.06 }}
      className="group"
    >
      {/* Heading row */}
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="eyebrow mb-2 text-[var(--gold)]">{d.region}</p>
          <h3 className="font-display text-3xl sm:text-4xl text-[var(--cream)] leading-tight">
            {d.name}
          </h3>
        </div>
        <div className="hidden sm:flex flex-wrap gap-1.5 justify-end max-w-[40%]">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-[var(--line)] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {allFailed ? (
        <div
          className="rounded-3xl h-[280px] flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${d.colour}30, var(--ink-3))` }}
        >
          <span className="font-display italic text-5xl text-[var(--gold)]">{d.name}</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 h-[280px] sm:h-[360px]">
          {photos.map((url, i) => {
            if (failed.has(i)) return null;
            // First photo spans 2 columns, larger; the next two stack on the right
            const isHero = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl ${
                  isHero ? 'col-span-2 row-span-2' : 'col-span-1'
                }`}
              >
                <img
                  src={url}
                  alt={`${d.name} ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fell) { markFailed(i); return; }
                    img.dataset.fell = '1';
                    img.src = `https://picsum.photos/seed/${encodeURIComponent(d.id)}-${i}/1200/800`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/40 to-transparent pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
