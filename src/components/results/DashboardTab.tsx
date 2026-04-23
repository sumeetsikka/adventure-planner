import { motion } from 'framer-motion';
import type { TravelConfig, GenerationResults, ResultsTab } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getCountryHero, getDestinationPhoto } from '../../lib/imagery';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
  onTabChange: (tab: ResultsTab) => void;
}

function parseCostMid(cost: string): number {
  const nums = cost.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseInt(n.replace(/,/g, '')));
  return values.length === 1 ? values[0] : Math.round((values[0] + values[1]) / 2);
}

export default function DashboardTab({ config, results, onTabChange }: Props) {
  const totalDays = Math.round(
    (new Date(config.returnDate).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const perPersonBudget = results.budget.reduce((sum, b) => sum + parseCostMid(b.cost), 0);
  const groupBudget = perPersonBudget * config.travellers;

  const stats = [
    { label: 'Days', value: results.itinerary.length || totalDays, action: 'itinerary' as ResultsTab },
    { label: 'Flights', value: results.flights.length, action: 'flights' as ResultsTab },
    { label: 'Hotels', value: results.hotels.length, action: 'hotels' as ResultsTab },
    { label: 'Transfers', value: results.transport.length, action: 'transport' as ResultsTab },
  ];

  const heroImage = getCountryHero(config.country?.name || 'travel', 1800, 900);

  return (
    <div className="space-y-8">
      {/* Editorial hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl overflow-hidden border border-[var(--line)] h-[360px]"
      >
        <img src={heroImage} alt={config.country?.name || ''} className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
          onError={(e) => { const i = e.currentTarget; if (i.dataset.fell) return; i.dataset.fell = '1'; i.src = `https://picsum.photos/seed/${encodeURIComponent(config.country?.id || 'trip')}-hero/1800/900`; }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.35) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.95) 100%)' }} />
        <div className="absolute inset-0 p-8 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
            <span className="eyebrow">Trip overview</span>
          </div>
          <div>
            <h2 className="font-display text-5xl sm:text-6xl text-[var(--cream)] mb-3">
              {config.country?.emoji} {config.country?.name || 'Adventure'}
            </h2>
            <p className="text-[var(--text-muted)] text-sm font-light">
              {formatDateAU(config.departureDate)} → {formatDateAU(config.returnDate)} · {totalDays} days · {config.travellers} traveller{config.travellers > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
            onClick={() => onTabChange(s.action)}
            className="surface-card p-5 text-left"
          >
            <p className="eyebrow text-[var(--text-dim)] mb-2">{s.label}</p>
            <p className="font-display text-4xl text-[var(--cream)]">{s.value}</p>
          </motion.button>
        ))}
      </div>

      {/* Budget feature */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="surface-soft p-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        <div>
          <p className="eyebrow text-[var(--text-dim)] mb-2">Per person</p>
          <p className="font-display text-5xl text-[var(--cream)]">${perPersonBudget.toLocaleString()}</p>
          <p className="text-[var(--text-muted)] text-xs mt-1 font-light">All-in estimate</p>
        </div>
        <div>
          <p className="eyebrow text-[var(--text-dim)] mb-2">Group total</p>
          <p className="font-display text-5xl text-[var(--gold)]">${groupBudget.toLocaleString()}</p>
          <p className="text-[var(--text-muted)] text-xs mt-1 font-light">{config.travellers} traveller{config.travellers > 1 ? 's' : ''}</p>
        </div>
      </motion.div>

      {/* Route preview */}
      <div>
        <div className="flex items-baseline gap-6 mb-5">
          <span className="eyebrow">The route</span>
          <h3 className="font-display text-2xl text-[var(--cream)] italic">As it unfolds.</h3>
          <div className="flex-1 h-px bg-[var(--line)]" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {config.destinations.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.05 }}
              className="relative rounded-2xl overflow-hidden h-40 border border-[var(--line)]"
            >
              <img src={getDestinationPhoto(d.name, 600, 400)} alt={d.name} className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { const i = e.currentTarget; if (i.dataset.fell) return; i.dataset.fell = '1'; i.src = `https://picsum.photos/seed/${encodeURIComponent(d.id)}/600/400`; }} />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${d.colour}40 60%, rgba(10,8,6,0.95) 100%)` }} />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-[9px] tracking-widest uppercase text-[var(--gold-soft)]">Stop {i + 1}</span>
                <p className="font-display text-lg text-[var(--cream)] leading-tight">{d.emoji} {d.name.split('(')[0].split('/')[0].trim()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { key: 'flights' as ResultsTab, label: 'Book flights', sub: `${results.flights.length} options to compare` },
          { key: 'hotels' as ResultsTab, label: 'Book hotels', sub: `${results.hotels.reduce((s, h) => s + h.hotels.length, 0)} stays across ${results.hotels.length} stops` },
          { key: 'bookings' as ResultsTab, label: 'Track bookings', sub: 'Check off what you\'ve booked' },
        ].map((a) => (
          <button key={a.key} onClick={() => onTabChange(a.key)}
            className="surface-card p-5 text-left group">
            <p className="font-display text-xl text-[var(--cream)] mb-1 group-hover:text-[var(--gold)] transition-colors">{a.label}</p>
            <p className="text-[var(--text-muted)] text-xs font-light">{a.sub}</p>
            <span className="text-[var(--text-dim)] text-[10px] tracking-widest uppercase mt-3 inline-block group-hover:text-[var(--gold)] transition-colors">Open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
