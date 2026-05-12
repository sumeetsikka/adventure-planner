import { useState } from 'react';
import { motion } from 'framer-motion';
import type { WeatherInfo, WeatherDay } from '../../types';

interface Props {
  weather: WeatherInfo[];
}

function getWeatherEmoji(description: string, rainfall_mm?: number): string {
  if (rainfall_mm != null) {
    if (rainfall_mm >= 10) return '☔';
    if (rainfall_mm >= 2) return '⛅';
  }
  const lower = description.toLowerCase();
  if (lower.includes('rain') || lower.includes('shower') || lower.includes('wet')) return '☔';
  if (lower.includes('sun') && !lower.includes('clou')) return '☀';
  if (lower.includes('cloud') || lower.includes('overcast') || lower.includes('mild')) return '⛅';
  if (lower.includes('hot') || lower.includes('warm')) return '☀';
  if (lower.includes('cold') || lower.includes('cool')) return '☁';
  return '⛅';
}

const EASE = [0.16, 1, 0.3, 1] as const;

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDayLabel(iso: string): { weekday: string; date: string } {
  // Parse as local date to avoid timezone drift on YYYY-MM-DD strings
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  if (isNaN(date.getTime())) return { weekday: '', date: iso };
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = date.toLocaleString('en-AU', { month: 'short' });
  return { weekday, date: `${day} ${month}` };
}

function addMinutesToHHMM(hhmm: string, minutes: number): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return hhmm;
  const total = h * 60 + m + minutes;
  const wrap = ((total % 1440) + 1440) % 1440;
  const hh = String(Math.floor(wrap / 60)).padStart(2, '0');
  const mm = String(wrap % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

function bestForLabel(day: WeatherDay): string {
  if (day.rainfall_mm >= 10) return 'Indoor museums, cafés, spas';
  if (day.rainfall_mm >= 3) return 'Markets, galleries, covered laneways';
  if (day.temp_high_c >= 30) return 'Early starts, water, shade by midday';
  if (day.temp_high_c >= 22) return 'Long walks, rooftop bars, sunsets';
  if (day.temp_high_c >= 14) return 'City exploring, hikes, picnics';
  return 'Cosy interiors, hot drinks, brisk walks';
}

function DayCard({ day, active, onClick }: { day: WeatherDay; active: boolean; onClick: () => void }) {
  const { weekday, date } = formatDayLabel(day.date);
  const emoji = getWeatherEmoji(day.description, day.rainfall_mm);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 w-[120px] rounded-2xl px-3 py-4 text-left transition border ${
        active
          ? 'bg-[var(--ink-2)] border-[var(--gold)]/60 shadow-[0_0_0_1px_var(--gold)]/20'
          : 'bg-[var(--ink-3)] border-[var(--line)] hover:border-[var(--line-strong)]'
      }`}
    >
      <p className="eyebrow mb-1">{weekday}</p>
      <p className="font-display text-[var(--cream)] text-sm leading-tight mb-3">{date}</p>
      <div className="text-3xl text-[var(--gold)] mb-2" aria-hidden>{emoji}</div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display text-2xl text-[var(--cream)] leading-none">{day.temp_high_c}°</span>
        <span className="text-[var(--text-muted)] text-sm">{day.temp_low_c}°</span>
      </div>
      <p className="text-[var(--text-muted)] text-[11px] leading-tight">
        {day.rainfall_mm > 0 ? `${day.rainfall_mm}mm rain` : 'no rain'}
      </p>
      {(day.sunrise || day.sunset) && (
        <p className="font-display-soft italic text-[var(--text-dim)] text-[10px] mt-2 leading-tight">
          {day.sunrise && <>↑ {day.sunrise}</>}
          {day.sunrise && day.sunset && ' · '}
          {day.sunset && <>↓ {day.sunset}</>}
        </p>
      )}
    </button>
  );
}

function DayDetail({ day }: { day: WeatherDay }) {
  const { weekday, date } = formatDayLabel(day.date);
  const goldenMorningStart = day.sunrise;
  const goldenMorningEnd = day.sunrise ? addMinutesToHHMM(day.sunrise, 30) : undefined;
  const goldenEveningStart = day.sunset ? addMinutesToHHMM(day.sunset, -30) : undefined;
  const goldenEveningEnd = day.sunset;

  return (
    <motion.div
      key={day.date}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="surface-soft rounded-3xl p-6 mt-4"
    >
      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
        <div>
          <p className="eyebrow mb-1">{weekday} · {date}</p>
          <p className="font-display text-2xl text-[var(--cream)] italic">{day.description}</p>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl text-[var(--cream)] leading-none">{day.temp_high_c}°</span>
          <span className="text-[var(--text-muted)]">/ {day.temp_low_c}°</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <div>
          <p className="eyebrow mb-1">Rainfall</p>
          <p className="text-[var(--cream)] text-sm">{day.rainfall_mm} mm</p>
        </div>
        {typeof day.uv_index === 'number' && (
          <div>
            <p className="eyebrow mb-1">UV index</p>
            <p className="text-[var(--cream)] text-sm">{day.uv_index} {day.uv_index >= 8 ? '· extreme' : day.uv_index >= 6 ? '· high' : day.uv_index >= 3 ? '· moderate' : '· low'}</p>
          </div>
        )}
        {day.sunrise && (
          <div>
            <p className="eyebrow mb-1">Sunrise</p>
            <p className="font-display-soft italic text-[var(--cream)] text-sm"><span className="text-[var(--gold)] not-italic">↑</span> {day.sunrise}</p>
          </div>
        )}
        {day.sunset && (
          <div>
            <p className="eyebrow mb-1">Sunset</p>
            <p className="font-display-soft italic text-[var(--cream)] text-sm"><span className="text-[var(--gold)] not-italic">↓</span> {day.sunset}</p>
          </div>
        )}
      </div>

      <div className="border-t border-[var(--line)] pt-4">
        <p className="eyebrow mb-2">Best for</p>
        <p className="font-display-soft italic text-[var(--cream)] text-[15px] leading-relaxed">{bestForLabel(day)}</p>
      </div>

      {(goldenMorningStart || goldenEveningStart) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {goldenMorningStart && goldenMorningEnd && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] text-[11px] font-medium tracking-[0.14em] uppercase">
              <span aria-hidden>✦</span> Golden hour · {goldenMorningStart}–{goldenMorningEnd}
            </span>
          )}
          {goldenEveningStart && goldenEveningEnd && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] text-[11px] font-medium tracking-[0.14em] uppercase">
              <span aria-hidden>✦</span> Golden hour · {goldenEveningStart}–{goldenEveningEnd}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function WeatherTab({ weather }: Props) {
  // Hooks must be called unconditionally — keep selected day as state at top.
  const [selected, setSelected] = useState<Record<string, string>>({});

  if (weather.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Forecast</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Reading the <span className="text-[var(--gold)]">skies</span>…</p>
      </div>
    );
  }

  const hasAnyForecast = weather.some((w) => w.forecast && w.forecast.length > 0);

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

      {/* Top summary row — existing destination cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
        {weather.map((w, i) => {
          const emoji = getWeatherEmoji(w.description);

          return (
            <motion.div
              key={`summary-${i}`}
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

      {/* Per-day forecast strip(s) */}
      {hasAnyForecast && (
        <div className="mb-4">
          <p className="eyebrow mb-3">Day by day</p>
          <h3 className="font-display text-2xl text-[var(--cream)] leading-tight mb-2">
            The trip, <span className="italic text-[var(--gold)]">hour by hour</span>
          </h3>
          <p className="font-display-soft italic text-[var(--text-muted)] text-sm max-w-xl">Tap a day to see UV, golden hour and what it’s best for.</p>
        </div>
      )}

      {weather.map((w, wi) => {
        if (!w.forecast || w.forecast.length === 0) return null;
        const activeDate = selected[w.destination] || w.forecast[0].date;
        const activeDay = w.forecast.find((d) => d.date === activeDate) || w.forecast[0];

        return (
          <motion.section
            key={`forecast-${wi}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + wi * 0.05 }}
            className="mb-10"
          >
            {weather.length > 1 && (
              <div className="flex items-baseline gap-3 mb-3">
                <p className="eyebrow">{w.destination}</p>
                <span className="font-display-soft italic text-[var(--text-muted)] text-xs">{w.forecast.length} day{w.forecast.length === 1 ? '' : 's'}</span>
              </div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
              {w.forecast.map((day) => (
                <div key={day.date} className="snap-start">
                  <DayCard
                    day={day}
                    active={day.date === activeDate}
                    onClick={() => setSelected((prev) => ({ ...prev, [w.destination]: day.date }))}
                  />
                </div>
              ))}
            </div>

            <DayDetail day={activeDay} />
          </motion.section>
        );
      })}
    </motion.div>
  );
}
