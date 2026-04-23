import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Destination } from '../../types';
import { getDestinationPhoto } from '../../lib/imagery';

interface Props {
  destinations: Destination[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function PhotosTab({ destinations }: Props) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

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
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Scenes from each place you&apos;re bound for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {destinations.map((d, i) => {
          const hasFailed = failedImages.has(d.id);
          const imgUrl = getDestinationPhoto(d.name, 1000, 700);
          const isLarge = i % 3 === 0;

          return (
            <motion.figure
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              className={`group relative rounded-3xl overflow-hidden surface-soft ${
                isLarge ? 'sm:col-span-2' : ''
              }`}
            >
              {hasFailed ? (
                <div
                  className="h-[420px] flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, var(--ink-3), var(--ink-4))`,
                  }}
                >
                  <span className="font-display italic text-5xl text-[var(--gold)]">{d.name}</span>
                </div>
              ) : (
                <div className={`relative overflow-hidden ${isLarge ? 'h-[480px]' : 'h-[360px]'}`}>
                  <img
                    src={imgUrl}
                    alt={d.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fell) { handleError(d.id); return; }
                      img.dataset.fell = '1';
                      img.src = `https://picsum.photos/seed/${encodeURIComponent(d.id)}/1000/700`;
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/50 to-transparent" />
                </div>
              )}

              <figcaption className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="eyebrow mb-2 text-[var(--gold)]">{d.region}</p>
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--cream)] leading-tight mb-3">
                  {d.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {d.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-[var(--cream)]/25 text-[var(--cream)]/80 bg-[var(--ink)]/40 backdrop-blur"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
    </motion.div>
  );
}
