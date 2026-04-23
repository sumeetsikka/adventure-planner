import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TravelConfig, GenerationResults } from '../../types';
import { geocodeDestination } from '../../lib/geocode';

// Fix Leaflet default marker icons (broken in bundlers)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  config: TravelConfig;
  results: GenerationResults;
}

interface GeoPoint {
  name: string;
  emoji: string;
  colour: string;
  lat: number;
  lon: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function createColourIcon(colour: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:26px;height:26px;border-radius:50%;background:${colour};border:3px solid #F5EDE0;box-shadow:0 2px 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

function FitBounds({ points }: { points: GeoPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function RouteMapTab({ config, results }: Props) {
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadCoords() {
      setLoading(true);
      const resolved: GeoPoint[] = [];
      for (const d of config.destinations) {
        const geo = await geocodeDestination(d.name);
        if (geo && !cancelled) {
          resolved.push({ name: d.name, emoji: d.emoji, colour: d.colour, lat: geo.lat, lon: geo.lon });
        }
      }
      if (!cancelled) {
        setPoints(resolved);
        setLoading(false);
      }
    }
    loadCoords();
    return () => { cancelled = true; };
  }, [config.destinations]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin mx-auto mb-5" />
        <p className="eyebrow">Plotting your route…</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="eyebrow mb-4">The route</p>
        <h2 className="font-display text-3xl text-[var(--cream)] mb-2">Map <em>unavailable</em>.</h2>
        <p className="text-[var(--text-muted)] text-sm">Could not resolve destination coordinates.</p>
      </div>
    );
  }

  const center: [number, number] = [
    points.reduce((s, p) => s + p.lat, 0) / points.length,
    points.reduce((s, p) => s + p.lon, 0) / points.length,
  ];

  const getHotel = (destName: string) => {
    const match = results.hotels.find(h =>
      destName.toLowerCase().includes(h.destination.toLowerCase().split('(')[0].trim()) ||
      h.destination.toLowerCase().includes(destName.toLowerCase().split('(')[0].trim())
    );
    if (!match) return null;
    return match.hotels.find(h => h.recommended) || match.hotels[0];
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }}>
      <div className="mb-8">
        <p className="eyebrow mb-3">On the map · {points.length} stops</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-[1.05] tracking-tight">
          The <em className="italic text-[var(--gold)]">route</em>.
        </h2>
        <p className="text-[var(--text-muted)] text-sm mt-3 max-w-md">Every stop plotted in sequence. Tap a marker for details.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="surface-card rounded-3xl overflow-hidden p-2"
      >
        <div className="rounded-[20px] overflow-hidden" style={{ height: '540px' }}>
          <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <FitBounds points={points} />

            <Polyline
              positions={points.map(p => [p.lat, p.lon] as [number, number])}
              pathOptions={{ color: '#D4A574', weight: 2.5, opacity: 0.8, dashArray: '6, 10' }}
            />

            {points.map((p, i) => {
              const hotel = getHotel(p.name);
              return (
                <Marker key={i} position={[p.lat, p.lon]} icon={createColourIcon(p.colour)}>
                  <Popup>
                    <div style={{ minWidth: '180px', color: '#0A0806', fontFamily: 'Inter, sans-serif' }}>
                      <p style={{ fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C65D3B', margin: '0 0 6px', fontWeight: 600 }}>
                        Stop {i + 1} of {points.length}
                      </p>
                      <p style={{ fontFamily: 'Fraunces, serif', fontWeight: 500, fontSize: '17px', margin: '0 0 6px', lineHeight: 1.2 }}>
                        {p.emoji} {p.name}
                      </p>
                      {hotel && (
                        <p style={{ fontSize: '11px', margin: '6px 0 0', color: '#3a2e24' }}>
                          <em>Stay:</em> {hotel.name} · {hotel.price_per_night_aud}/night
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="mt-8">
        <p className="eyebrow mb-4">The stops</p>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {points.map((p, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-display text-sm text-[var(--text-dim)]">{String(i + 1).padStart(2, '0')}</span>
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.colour }} />
              <span className="text-[var(--text)] text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
