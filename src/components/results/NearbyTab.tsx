import type { NearbyPlace, Destination } from '../../types';

interface Props {
  nearby: NearbyPlace[];
  destinations?: Destination[];
}

export default function NearbyTab({ nearby }: Props) {
  if (nearby.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🗺️</span>
        <p className="text-[var(--cream)] font-medium">Nearby places are loading</p>
      </div>
    );
  }

  // Group by destination
  const groups = nearby.reduce<Record<string, NearbyPlace[]>>((acc, place) => {
    const dest = place.destination;
    if (!acc[dest]) acc[dest] = [];
    acc[dest].push(place);
    return acc;
  }, {});

  const destNames = Object.keys(groups);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Nearby Gems</h2>
        <p className="text-[var(--text-muted)] text-sm">Day trips and detours from your destinations</p>
      </div>

      <div className="space-y-8">
        {destNames.map((dest) => (
          <div key={dest}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-[var(--text-muted)] text-sm font-semibold">
                While you&apos;re in{' '}
                <span className="text-[var(--cream)] font-bold">{dest}</span>...
              </h3>
              <div className="flex-1 h-px bg-[var(--ink-4)]" />
            </div>

            {/* Place cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groups[dest].map((place, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-5 hover:border-[var(--line-strong)] hover:bg-[var(--ink-4)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-[var(--cream)] font-bold text-sm leading-snug">{place.name}</h4>
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full bg-[var(--ink-4)] text-[var(--text-muted)] whitespace-nowrap">
                      {place.travel_time}
                    </span>
                  </div>

                  <p className="text-gray-300 text-[12px] leading-relaxed mb-3">{place.why_visit}</p>

                  <div className="pt-2 border-t border-[var(--line)]">
                    <p className="text-[var(--text-muted)] text-[11px] italic">{place.highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
