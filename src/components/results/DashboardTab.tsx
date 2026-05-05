import { motion } from 'framer-motion';
import type { TravelConfig, GenerationResults, ResultsTab } from '../../types';
import { formatDateAU, todayISO, addDaysISO } from '../../lib/dateUtils';
import { getCountryHero, getDestinationPhoto } from '../../lib/imagery';
import { useGeolocation } from '../../lib/useGeolocation';
import { directionsUrl } from '../../lib/deepLinks';

const EASE = [0.16, 1, 0.3, 1] as const;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

  // Today panel: only show if trip is currently underway
  const today = todayISO();
  const daysSinceDeparture = Math.floor(
    (new Date(today).getTime() - new Date(config.departureDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const tripUnderway = daysSinceDeparture >= 0 && daysSinceDeparture < totalDays;

  // Geolocation only fires while the trip is underway — no permission prompt
  // for users planning future trips.
  const geo = useGeolocation(tripUnderway);

  let todayPanel: React.ReactNode = null;
  if (tripUnderway) {
    const todayEntry = results.itinerary[daysSinceDeparture] || null;
    const tomorrowEntry = results.itinerary[daysSinceDeparture + 1] || null;
    const todayDate = today;
    const tomorrowDate = addDaysISO(today, 1);
    const todayWeekday = DAY_NAMES[new Date(todayDate).getDay()];

    const upcomingTransport = (results.transport || []).find(
      (t) => t.date === todayDate || t.date === tomorrowDate
    );

    const todayCity = todayEntry?.location?.split('(')[0].split('/')[0].trim() || config.country?.name || '';
    const todayWeather = (results.weather || []).find((w) => todayCity && w.destination.toLowerCase().includes(todayCity.toLowerCase()));

    todayPanel = (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="surface-card rounded-3xl p-7 border-[var(--gold)]/40"
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
          <span className="eyebrow text-[var(--gold)]">Live · Today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-[var(--text-dim)] text-[11px] uppercase tracking-wider mb-2">
              Day {daysSinceDeparture + 1} · {todayWeekday} {formatDateAU(todayDate)} · {todayCity}
            </p>
            {todayEntry ? (
              <>
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--cream)] leading-tight">
                  <em className="italic text-[var(--gold)]">{todayEntry.title}</em>
                </h3>
                {todayEntry.activities.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {todayEntry.activities.slice(0, 3).map((a, i) => (
                      <li key={i} className="text-[var(--text-muted)] text-[13px] leading-relaxed">— {a}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <h3 className="font-display text-2xl text-[var(--cream)]">A free day.</h3>
            )}

            {tomorrowEntry && (
              <p className="mt-5 text-[var(--text-muted)] text-sm">
                <span className="eyebrow mr-2">Tomorrow</span>
                <span className="text-[var(--cream)]">→ {tomorrowEntry.location.split('(')[0].split('/')[0].trim()}</span>
                <span className="text-[var(--text-dim)]"> · {tomorrowEntry.title}</span>
              </p>
            )}

            {upcomingTransport && (
              <div className="mt-4 surface-soft rounded-2xl px-4 py-3">
                <p className="eyebrow mb-1">Next leg · {upcomingTransport.date === todayDate ? 'today' : 'tomorrow'}</p>
                <p className="text-[var(--cream)] text-sm">
                  {upcomingTransport.from} → {upcomingTransport.to}
                  <span className="text-[var(--text-dim)]"> · {upcomingTransport.mode} · {upcomingTransport.duration}</span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {todayWeather && (
              <div className="surface-soft rounded-2xl px-4 py-3">
                <p className="eyebrow mb-1">Weather</p>
                <p className="font-display text-2xl text-[var(--cream)] leading-none">
                  {todayWeather.temp_high_c}°<span className="text-[var(--text-dim)] text-base"> / {todayWeather.temp_low_c}°</span>
                </p>
                <p className="text-[var(--text-muted)] text-[11px] mt-1 leading-snug">{todayWeather.description}</p>
              </div>
            )}

            {/* Live location card */}
            <div className="surface-soft rounded-2xl px-4 py-3">
              <p className="eyebrow mb-1">You are</p>
              {geo.status === 'requesting' && (
                <p className="text-[var(--text-muted)] text-[12px] italic font-light">Locating…</p>
              )}
              {geo.status === 'granted' && geo.lat !== null && geo.lng !== null && (
                <>
                  <p className="text-[var(--cream)] text-[13px] font-light">
                    Near {todayCity}
                  </p>
                  <a
                    href={directionsUrl(todayCity)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] hover:text-[var(--gold-soft)] transition-colors"
                  >
                    ➞ Get me there
                  </a>
                </>
              )}
              {geo.status === 'denied' && (
                <p className="text-[var(--text-dim)] text-[11px] font-light italic leading-snug">Location off — turn on for live routing.</p>
              )}
              {(geo.status === 'idle' || geo.status === 'unavailable') && geo.status !== 'denied' && (
                <p className="text-[var(--text-dim)] text-[11px] font-light italic leading-snug">{todayCity}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => onTabChange('map')} className="surface-soft rounded-2xl px-2 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Map</button>
              <button onClick={() => onTabChange('itinerary')} className="surface-soft rounded-2xl px-2 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Itinerary</button>
              <button onClick={() => onTabChange('currency')} className="surface-soft rounded-2xl px-2 py-3 text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">Currency</button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {todayPanel}
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
