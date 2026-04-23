import { useState, useEffect } from 'react';
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

function createColourIcon(colour: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50%;background:${colour};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
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
      <div className="text-center py-16">
        <div className="w-8 h-8 border-2 border-[#C65D3B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[var(--text-muted)]">Loading map coordinates...</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🗺️</span>
        <p className="text-[var(--text-muted)]">Could not resolve destination coordinates for the map.</p>
      </div>
    );
  }

  const center: [number, number] = [
    points.reduce((s, p) => s + p.lat, 0) / points.length,
    points.reduce((s, p) => s + p.lon, 0) / points.length,
  ];

  // Find hotel for each destination
  const getHotel = (destName: string) => {
    const match = results.hotels.find(h =>
      destName.toLowerCase().includes(h.destination.toLowerCase().split('(')[0].trim()) ||
      h.destination.toLowerCase().includes(destName.toLowerCase().split('(')[0].trim())
    );
    if (!match) return null;
    return match.hotels.find(h => h.recommended) || match.hotels[0];
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Your Route Map</h2>
        <p className="text-[var(--text-muted)] text-sm">{points.length} destinations plotted. Tap a marker for details.</p>
      </div>

      <div className="rounded-2xl overflow-hidden border border-[var(--line)]" style={{ height: '500px' }}>
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <FitBounds points={points} />

          {/* Route polyline */}
          <Polyline
            positions={points.map(p => [p.lat, p.lon] as [number, number])}
            pathOptions={{ color: '#C65D3B', weight: 3, opacity: 0.7, dashArray: '8, 8' }}
          />

          {/* Destination markers */}
          {points.map((p, i) => {
            const hotel = getHotel(p.name);
            return (
              <Marker key={i} position={[p.lat, p.lon]} icon={createColourIcon(p.colour)}>
                <Popup>
                  <div style={{ minWidth: '160px', color: '#1e293b' }}>
                    <p style={{ fontWeight: 'bold', fontSize: '14px', margin: '0 0 4px' }}>
                      {p.emoji} {p.name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px' }}>
                      Stop {i + 1} of {points.length}
                    </p>
                    {hotel && (
                      <p style={{ fontSize: '11px', margin: '0' }}>
                        🏨 {hotel.name} ({hotel.price_per_night_aud}/night)
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-3">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]">
            <div className="w-3 h-3 rounded-full" style={{ background: p.colour }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
