import { useState } from 'react';
import { motion } from 'framer-motion';
import { listTrips, deleteTrip, renameTrip, type SavedTrip } from '../../lib/tripStore';
import { useWikiImage } from '../../lib/useWikiImage';
import { formatDateAU } from '../../lib/dateUtils';

interface Props {
  onLoad: (trip: SavedTrip) => void;
  onNew: () => void;
  onInspire?: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MyTrips({ onLoad, onNew }: Props) {
  const [trips, setTrips] = useState<SavedTrip[]>(() => listTrips());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const refresh = () => setTrips(listTrips());

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this trip permanently?')) return;
    deleteTrip(id);
    refresh();
  };

  const startRename = (trip: SavedTrip) => {
    setRenamingId(trip.id);
    setRenameValue(trip.name);
  };

  const commitRename = (id: string) => {
    if (renameValue.trim()) renameTrip(id, renameValue.trim());
    setRenamingId(null);
    refresh();
  };

  return (
    <div className="min-h-screen px-6 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--gold)] animate-gentle-pulse" />
            <span className="eyebrow">Your library</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h1 className="font-display text-5xl sm:text-7xl text-[var(--cream)] leading-[0.95]">
              Every <em className="italic text-shimmer">journey</em>.
            </h1>
            <button
              onClick={onNew}
              className="px-6 py-3 rounded-full bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)] transition-colors text-sm font-medium tracking-wide"
            >
              + New trip
            </button>
          </div>
          <p className="text-[var(--text-muted)] mt-4 max-w-xl font-light">
            {trips.length === 0
              ? 'Start your first adventure.'
              : `${trips.length} ${trips.length === 1 ? 'story' : 'stories'} saved on this device.`}
          </p>
        </motion.div>

        {trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center py-20"
          >
            <span className="text-6xl block mb-6">🌍</span>
            <p className="font-display text-3xl text-[var(--cream)] italic mb-3">No trips yet.</p>
            <p className="text-[var(--text-muted)] text-sm mb-8 max-w-sm mx-auto font-light">
              Plan your first adventure — pick a country, choose your destinations, and watch the story unfold.
            </p>
            <button
              onClick={onNew}
              className="px-8 py-3.5 rounded-full bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--paper)] transition-colors text-sm font-medium tracking-wide"
            >
              Plan your first trip →
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((trip, i) => (
              <TripCard
                key={trip.id}
                trip={trip}
                index={i}
                isRenaming={renamingId === trip.id}
                renameValue={renameValue}
                onRenameChange={setRenameValue}
                onStartRename={() => startRename(trip)}
                onCommitRename={() => commitRename(trip.id)}
                onLoad={() => onLoad(trip)}
                onDelete={() => handleDelete(trip.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CardProps {
  trip: SavedTrip;
  index: number;
  isRenaming: boolean;
  renameValue: string;
  onRenameChange: (v: string) => void;
  onStartRename: () => void;
  onCommitRename: () => void;
  onLoad: () => void;
  onDelete: () => void;
}

function TripCard({
  trip, index, isRenaming, renameValue, onRenameChange, onStartRename, onCommitRename, onLoad, onDelete,
}: CardProps) {
  const photo = useWikiImage(trip.config.country.name, 'country');
  const days = Math.max(
    1,
    Math.round(
      (new Date(trip.config.returnDate).getTime() - new Date(trip.config.departureDate).getTime()) /
        86_400_000,
    ),
  );
  const stops = trip.config.destinations.length;
  const hasResults = trip.results.itinerary.length > 0 || trip.results.flights.length > 0;
  const updated = new Date(trip.updatedAt);
  const updatedLabel = formatRelative(updated);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05 + index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl overflow-hidden border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors h-72 cursor-pointer"
      style={{
        background: `linear-gradient(145deg, ${trip.config.country.colour}cc 0%, ${trip.config.country.colour}55 50%, var(--ink-2) 100%)`,
      }}
      onClick={() => !isRenaming && onLoad()}
    >
      {photo && (
        <img
          src={photo}
          alt={trip.config.country.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-all duration-[1.2s] group-hover:scale-105"
          onError={(e) => {
            const i = e.currentTarget;
            if (i.dataset.fell) { i.style.display = 'none'; return; }
            i.dataset.fell = '1';
            i.src = `https://picsum.photos/seed/${encodeURIComponent(trip.config.country.id)}/800/600`;
          }}
        />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,8,6,0.15) 0%, rgba(10,8,6,0.55) 50%, rgba(10,8,6,0.95) 100%)' }} />

      {/* Top row: status + actions */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        <span
          className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm ${
            hasResults
              ? 'bg-[var(--gold)]/85 text-[var(--ink)]'
              : 'bg-[var(--ink)]/60 text-[var(--cream)] border border-[var(--line-strong)]'
          }`}
        >
          {hasResults ? 'Ready' : 'Drafting'}
        </span>
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onStartRename}
            className="w-7 h-7 rounded-full bg-[var(--ink)]/70 backdrop-blur-sm flex items-center justify-center text-[var(--cream)] text-[10px] hover:bg-[var(--ink)]/90 border border-[var(--line-strong)]"
            aria-label="Rename trip"
          >
            ✎
          </button>
          <button
            onClick={onDelete}
            className="w-7 h-7 rounded-full bg-[var(--ink)]/70 backdrop-blur-sm flex items-center justify-center text-[var(--cream)] text-[10px] hover:bg-[var(--terracotta)]/80 border border-[var(--line-strong)]"
            aria-label="Delete trip"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
        <p className="eyebrow mb-2 drop-shadow-md" style={{ color: 'var(--gold-soft)' }}>
          {trip.config.country.emoji} {trip.config.country.name}
        </p>
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => onRenameChange(e.target.value)}
            onBlur={onCommitRename}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onCommitRename();
              if (e.key === 'Escape') onCommitRename();
            }}
            className="font-display text-2xl text-[var(--cream)] bg-transparent border-b border-[var(--gold)] focus:outline-none mb-3 w-full"
          />
        ) : (
          <h3 className="font-display text-2xl sm:text-[26px] text-[var(--cream)] leading-tight mb-3 drop-shadow-md">
            {trip.name}
          </h3>
        )}
        <div className="flex items-center gap-3 text-[11px] text-[var(--cream)]/80 mb-4 font-light">
          {trip.config.departureDate && (
            <>
              <span>{formatDateAU(trip.config.departureDate)}</span>
              <span className="text-[var(--text-dim)]">·</span>
            </>
          )}
          <span>{days} {days === 1 ? 'day' : 'days'}</span>
          <span className="text-[var(--text-dim)]">·</span>
          <span>{stops} {stops === 1 ? 'stop' : 'stops'}</span>
        </div>
        <div className="pt-3 border-t border-[var(--cream)]/15 flex items-center justify-between">
          <span className="text-[10px] tracking-wider text-[var(--text-dim)]">Updated {updatedLabel}</span>
          <span className="text-[var(--cream)] text-sm group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
}

function formatRelative(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}
