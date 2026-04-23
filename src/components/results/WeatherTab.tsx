import { motion } from 'framer-motion';
import type { WeatherInfo } from '../../types';

interface Props {
  weather: WeatherInfo[];
}

function getWeatherEmoji(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('sunny') || lower.includes('sun')) return '☀';
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('wet')) return '☔';
  if (lower.includes('cloud') || lower.includes('overcast')) return '☁';
  if (lower.includes('hot') || lower.includes('heat') || (lower.includes('warm') && lower.includes('humid'))) return '☼';
  if (lower.includes('cold') || lower.includes('snow') || lower.includes('freez')) return '❆';
  return '☁';
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function WeatherTab({ weather }: Props) {
  if (weather.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Forecast</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Reading the <span className="text-[var(--gold)]">skies</span>…</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter I — Forecast</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          The <span className="italic text-[var(--gold)]">weather</span> ahead
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">Expected conditions across the places you’re bound for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {weather.map((w, i) => {
          const emoji = getWeatherEmoji(w.description);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: i * 0.06 }}
              className="surface-soft rounded-3xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="eyebrow mb-1.5">{w.month}</p>
                  <h4 className="font-display text-xl text-[var(--cream)] leading-tight">{w.destination}</h4>
                </div>
                <span className="text-4xl text-[var(--gold)]" aria-hidden>{emoji}</span>
              </div>

              <div className="flex items-end gap-6 mb-5">
                <div>
                  <p className="eyebrow mb-1">High</p>
                  <p className="font-display text-5xl text-[var(--cream)] leading-none">{w.temp_high_c}<span className="text-2xl text-[var(--text-muted)]">°</span></p>
                </div>
                <div className="pb-1">
                  <p className="eyebrow mb-1">Low</p>
                  <p className="font-display text-2xl text-[var(--text-muted)] leading-none">{w.temp_low_c}°</p>
                </div>
              </div>

              <div className="divider mb-4" />

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="eyebrow mb-1">Rainfall</p>
                  <p className="text-[var(--cream)] text-sm">{w.rainfall_mm} mm</p>
                </div>
                <div>
                  <p className="eyebrow mb-1">Humidity</p>
                  <p className="text-[var(--cream)] text-sm">{w.humidity_percent}%</p>
                </div>
              </div>

              <p className="text-[var(--text-muted)] text-[13px] leading-relaxed mb-4 flex-1">{w.description}</p>

              <p className="font-display-soft italic text-[var(--text-dim)] text-[13px] leading-relaxed pt-4 border-t border-[var(--line)]">
                Pack — {w.what_to_pack}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
