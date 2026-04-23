import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Country, Destination } from '../../types';
import { countries } from '../../data/countries';
import { getDestinationsForCountry } from '../../data/destinations';
import { generateDestinations } from '../../lib/api';
import { useWikiImage } from '../../lib/useWikiImage';
import DestinationCard from './DestinationCard';

interface Props {
  selected: Destination[];
  onSelect: (destinations: Destination[]) => void;
  onNext: () => void;
  country: Country;
  destinations: Destination[];
  onBackToCountries: () => void;
  onAddDestinations?: (newDests: Destination[]) => void;
}

export default function DestinationPicker({ selected, onSelect, onNext, country, destinations, onBackToCountries, onAddDestinations }: Props) {
  const [showAddCountry, setShowAddCountry] = useState(false);
  const [addingCountry, setAddingCountry] = useState(false);

  const handleAddFromCountry = async (c: Country) => {
    if (!onAddDestinations) return;
    setAddingCountry(true);
    try {
      const prebuilt = getDestinationsForCountry(c.id);
      if (prebuilt) {
        onAddDestinations(prebuilt);
      } else {
        const generated = await generateDestinations(c);
        onAddDestinations(generated);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setAddingCountry(false);
      setShowAddCountry(false);
    }
  };

  const selectedIds = new Set(selected.map((d) => d.id));
  const mustVisitDests = destinations.filter((d) => d.mustVisit);
  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  const toggle = (id: string) => {
    if (selectedIds.has(id)) {
      onSelect(selected.filter((d) => d.id !== id));
    } else {
      const dest = destinations.find((d) => d.id === id);
      if (dest) onSelect([...selected, dest]);
    }
  };

  const totalDays = selected.reduce((sum, d) => {
    return sum + Math.round((d.recommendedDays[0] + d.recommendedDays[1]) / 2);
  }, 0);

  const heroImage = useWikiImage(country.name);

  return (
    <div className="relative min-h-screen">
      {/* Editorial banner */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={heroImage}
          alt={country.name}
          className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.6) 0%, rgba(10,8,6,0.3) 40%, var(--ink) 100%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
          <button onClick={onBackToCountries}
            className="eyebrow text-[var(--text-muted)] hover:text-[var(--cream)] transition-colors">
            ← All Countries
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-16 left-0 right-0 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <p className="eyebrow mb-4">Chapter Two · Design your route</p>
            <h1 className="font-display text-6xl sm:text-8xl text-[var(--cream)] mb-4 flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl">{country.emoji}</span>
              <span>{country.name}</span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl font-light italic font-display-soft">
              {country.tagline}.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 pb-40 -mt-12">
        {/* Must Visit */}
        {mustVisitDests.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
          >
            <div className="flex items-baseline gap-6 mb-8">
              <span className="eyebrow">Editor's Picks</span>
              <h2 className="font-display text-3xl sm:text-4xl text-[var(--cream)] italic">
                The essentials.
              </h2>
              <div className="flex-1 h-px bg-[var(--line-strong)]" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {mustVisitDests.map((d) => (
                <DestinationCard key={d.id} destination={d} selected={selectedIds.has(d.id)} onToggle={toggle} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Regions */}
        {regions.map((region, ri) => {
          const regionDests = destinations.filter((d) => d.region === region);
          return (
            <motion.section
              key={region}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + ri * 0.1 }}
              className="mb-14"
            >
              <div className="flex items-baseline gap-6 mb-6">
                <h2 className="font-display text-2xl sm:text-3xl text-[var(--cream)]">{region}</h2>
                <div className="flex-1 h-px bg-[var(--line)]" />
                <span className="eyebrow text-[var(--text-dim)]">{regionDests.length} places</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {regionDests.map((d) => (
                  <DestinationCard key={`${region}-${d.id}`} destination={d} selected={selectedIds.has(d.id)} onToggle={toggle} />
                ))}
              </div>
            </motion.section>
          );
        })}

        {/* Add from another country */}
        {onAddDestinations && (
          <div className="mt-16">
            <div className="divider mb-10" />
            {!showAddCountry ? (
              <button onClick={() => setShowAddCountry(true)}
                className="w-full max-w-lg mx-auto block rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--ink-2)]/60 backdrop-blur-md p-8 text-center hover:border-[var(--gold)]/40 transition-all">
                <span className="text-3xl block mb-3">🌍</span>
                <span className="font-display text-2xl text-[var(--cream)] block mb-1">Extend your journey</span>
                <span className="text-[var(--text-muted)] text-sm block font-light">Add destinations from another country</span>
              </button>
            ) : addingCountry ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="eyebrow text-[var(--text-muted)]">Loading destinations</p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--line-strong)] bg-[var(--ink-2)]/80 backdrop-blur-md p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display text-xl text-[var(--cream)]">Pick a country to add</h3>
                  <button onClick={() => setShowAddCountry(false)} className="text-[var(--text-dim)] hover:text-[var(--cream)] text-2xl leading-none">×</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {countries.filter((c) => c.id !== country.id).map((c) => (
                    <button key={c.id} onClick={() => handleAddFromCountry(c)}
                      className="rounded-xl border border-[var(--line)] bg-[var(--ink-3)] hover:bg-[var(--ink-4)] hover:border-[var(--line-strong)] p-3 text-center transition-all">
                      <span className="text-xl block">{c.emoji}</span>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-1 font-light">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="pt-10 px-4" style={{
          paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg, transparent 0%, rgba(10,8,6,0.85) 40%, var(--ink) 100%)'
        }}>
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className="rounded-full bg-[var(--ink-2)]/90 backdrop-blur-xl border border-[var(--line-strong)] px-6 py-3 flex items-center justify-between shadow-2xl">
              <div>
                <p className="text-[var(--cream)] text-sm font-light">
                  {selected.length === 0 ? (
                    <span className="italic text-[var(--text-muted)]">Nothing selected yet</span>
                  ) : (
                    <>
                      <span className="font-display text-2xl">{selected.length}</span>{' '}
                      <span className="text-[var(--text-muted)]">destination{selected.length !== 1 ? 's' : ''} · ~{totalDays} days</span>
                    </>
                  )}
                </p>
              </div>
              <button onClick={onNext} disabled={selected.length === 0}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  selected.length > 0
                    ? 'bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)]'
                    : 'bg-[var(--ink-4)] text-[var(--text-dim)] cursor-not-allowed'
                }`}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
