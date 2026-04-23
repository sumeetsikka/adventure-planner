import { useState } from 'react';
import type { TravelConfig, GenerationResults } from '../../types';
import { formatDateAU } from '../../lib/dateUtils';
import { getFlightLinks, getHotelLinks } from '../../lib/bookingLinks';

interface Props {
  config: TravelConfig;
  results: GenerationResults;
}

interface BookingItem {
  id: string;
  category: string;
  icon: string;
  title: string;
  detail: string;
  links: Record<string, string>;
}

export default function BookingTrackerTab({ config, results }: Props) {
  const [booked, setBooked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setBooked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Build booking items from results
  const items: BookingItem[] = [];
  const adults = config.travellers;
  const children = config.ages?.filter(a => a < 18).length || 0;
  const rooms = Math.max(1, Math.ceil(adults / 2));

  // Flights
  results.flights.forEach((f, i) => {
    items.push({
      id: `flight-${i}`,
      category: 'Flights',
      icon: f.type === 'international' ? '✈️' : '🛫',
      title: f.leg,
      detail: `${formatDateAU(f.date)} · ${f.duration} · ${f.price_estimate_aud}`,
      links: getFlightLinks(f.from_code, f.to_code, f.date, undefined, adults, children),
    });
  });

  // Hotels
  results.hotels.forEach((dest, i) => {
    const topPick = dest.hotels.find(h => h.recommended) || dest.hotels[0];
    if (topPick) {
      items.push({
        id: `hotel-${i}`,
        category: 'Hotels',
        icon: '🏨',
        title: `${topPick.name} in ${dest.destination}`,
        detail: `${formatDateAU(dest.check_in)} to ${formatDateAU(dest.check_out)} · ${dest.nights}n · ${topPick.price_per_night_aud}/night`,
        links: getHotelLinks(dest.destination, dest.check_in, dest.check_out, adults, rooms),
      });
    }
  });

  // Transport
  results.transport.forEach((t, i) => {
    items.push({
      id: `transport-${i}`,
      category: 'Transport',
      icon: '🚆',
      title: `${t.from} → ${t.to}`,
      detail: `${formatDateAU(t.date)} · ${t.mode} · ${t.duration} · ${t.price_estimate_aud}`,
      links: { 'Rome2Rio': `https://www.rome2rio.com/s/${encodeURIComponent(t.from)}/${encodeURIComponent(t.to)}` },
    });
  });

  const total = items.length;
  const done = booked.size;
  const pct = total > 0 ? (done / total) * 100 : 0;

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Booking Tracker</h2>
        <p className="text-[var(--text-muted)] text-sm">Tick off each booking as you complete it. Links open the booking site with your details pre-filled.</p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[var(--cream)] font-semibold text-sm">{done} of {total} booked</span>
          <span className="text-[#7A9082] font-bold text-sm">{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-2.5 bg-[var(--ink-3)] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#7A9082] to-[#7A9082]/50 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        {done === total && total > 0 && (
          <p className="text-[#7A9082] text-xs mt-2 font-semibold">All booked! You're ready to go! 🎉</p>
        )}
      </div>

      {/* Booking items by category */}
      {total === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">📝</span>
          <p className="text-[var(--text-muted)]">No bookings to track yet. Generate your trip first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => {
            const catItems = items.filter(i => i.category === cat);
            return (
              <div key={cat} className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] overflow-hidden">
                <div className="px-5 py-3 border-b border-[var(--line)]">
                  <h3 className="text-[var(--cream)] font-semibold text-sm">{cat} ({catItems.filter(i => booked.has(i.id)).length}/{catItems.length})</h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {catItems.map((item) => {
                    const isBooked = booked.has(item.id);
                    return (
                      <div key={item.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                        <button type="button" onClick={() => toggle(item.id)} className="flex-shrink-0 mt-0.5">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isBooked ? 'bg-[#7A9082] border-[#7A9082]' : 'border-white/20'
                          }`}>
                            {isBooked && <span className="text-[var(--cream)] text-[10px]">✓</span>}
                          </div>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span>{item.icon}</span>
                            <p className={`text-sm font-medium transition-all ${isBooked ? 'text-[var(--text-dim)] line-through' : 'text-[var(--cream)]'}`}>{item.title}</p>
                          </div>
                          <p className="text-[var(--text-muted)] text-[11px] mb-2">{item.detail}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(item.links).slice(0, 3).map(([name, url]) => (
                              <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                                className="text-[9px] font-semibold px-2 py-0.5 rounded-lg bg-[#D4A574]/10 text-[#D4A574] hover:bg-[#D4A574]/20 transition-colors">
                                {name} ↗
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
