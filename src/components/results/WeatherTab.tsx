import type { WeatherInfo } from '../../types';

interface Props {
  weather: WeatherInfo[];
}

function getWeatherEmoji(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('sunny') || lower.includes('sun')) return '☀️';
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('wet')) return '🌧️';
  if (lower.includes('cloud') || lower.includes('overcast')) return '☁️';
  if (lower.includes('hot') || lower.includes('heat') || (lower.includes('warm') && lower.includes('humid'))) return '🔥';
  if (lower.includes('cold') || lower.includes('snow') || lower.includes('freez')) return '❄️';
  return '🌤️';
}

function getTempColour(temp: number): string {
  if (temp < 15) return 'text-blue-400';
  if (temp < 25) return 'text-green-400';
  if (temp < 35) return 'text-orange-400';
  return 'text-red-400';
}

export default function WeatherTab({ weather }: Props) {
  if (weather.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🌤️</span>
        <p className="text-[var(--cream)] font-medium">Weather data is loading</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Weather Forecast</h2>
        <p className="text-[var(--text-muted)] text-sm">Expected conditions during your trip</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {weather.map((w, i) => {
          const emoji = getWeatherEmoji(w.description);
          const highColour = getTempColour(w.temp_high_c);
          const lowColour = getTempColour(w.temp_low_c);

          return (
            <div
              key={i}
              className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-5 hover:border-[var(--line-strong)] hover:bg-[var(--ink-4)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-[var(--cream)] font-bold text-sm leading-snug">{w.destination}</h4>
                  <p className="text-[var(--text-muted)] text-[11px] mt-0.5">{w.month}</p>
                </div>
                <span className="text-3xl">{emoji}</span>
              </div>

              {/* Temperature */}
              <div className="flex items-center gap-3 mb-3">
                <div className="text-center">
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-0.5">High</p>
                  <p className={`font-bold text-lg ${highColour}`}>{w.temp_high_c}°C</p>
                </div>
                <div className="w-px h-8 bg-[var(--ink-4)]" />
                <div className="text-center">
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-0.5">Low</p>
                  <p className={`font-bold text-lg ${lowColour}`}>{w.temp_low_c}°C</p>
                </div>
              </div>

              {/* Rainfall + humidity */}
              <div className="flex gap-3 mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💧</span>
                  <span className="text-[var(--text-muted)] text-xs">{w.rainfall_mm}mm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💦</span>
                  <span className="text-[var(--text-muted)] text-xs">{w.humidity_percent}% humidity</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-[var(--text-muted)] text-[12px] leading-relaxed mb-3">{w.description}</p>

              {/* Pack advice */}
              <div className="pt-2 border-t border-[var(--line)]">
                <p className="text-[var(--text-muted)] text-[11px] italic">Pack: {w.what_to_pack}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
