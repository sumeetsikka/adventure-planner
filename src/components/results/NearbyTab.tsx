import { motion } from 'framer-motion';
import type { NearbyPlace, Destination } from '../../types';
import { getDestinationPhoto } from '../../lib/imagery';

interface Props {
  nearby: NearbyPlace[];
  destinations?: Destination[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function NearbyTab({ nearby }: Props) {
  if (nearby.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Detours</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Scouting <span className="text-[var(--gold)]">nearby</span>…</p>
      </div>
    );
  }

  const groups = nearby.reduce<Record<string, NearbyPlace[]>>((acc, place) => {
    const dest = place.destination;
    if (!acc[dest]) acc[dest] = [];
    acc[dest].push(place);
    return acc;
  }, {});

  const destNames = Object.keys(groups);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter IV — Detours</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Nearby <span className="italic text-[var(--gold)]">gems</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Day trips and worthwhile departures from each base.</p>
      </div>

      <div className="space-y-14">
        {destNames.map((dest, gi) => (
          <motion.section
            key={dest}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: gi * 0.08 }}
          >
            <div className="flex items-baseline gap-4 mb-6">
              <p className="eyebrow">While in</p>
              <h3 className="font-display italic text-2xl text-[var(--cream)]">{dest}</h3>
              <div className="flex-1 h-px bg-[var(--line)]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {groups[dest].map((place, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                  className="surface-soft rounded-3xl overflow-hidden flex flex-col group"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getDestinationPhoto(place.name, 600, 400)}
                      alt={place.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                      <h4 className="font-display text-lg text-[var(--cream)] leading-tight pr-2">{place.name}</h4>
                      <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] uppercase px-3 py-1 rounded-full border border-[var(--cream)]/30 text-[var(--cream)] bg-[var(--ink)]/40 backdrop-blur">
                        {place.travel_time}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4 flex-1">{place.why_visit}</p>
                    <div className="pt-4 border-t border-[var(--line)]">
                      <p className="eyebrow mb-1">Highlight</p>
                      <p className="font-display-soft italic text-[var(--cream)] text-[13px] leading-relaxed">{place.highlight}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}
