import { useState, useEffect, useRef } from 'react';

interface Props {
  destinations: string[];
  progress: {
    route: boolean;
    flights: boolean;
    hotels: boolean;
    itinerary: boolean;
    budget: boolean;
    tips: boolean;
    packing: boolean;
    weather: boolean;
    visa: boolean;
    currency: boolean;
    nearby: boolean;
    transport: boolean;
  };
}

const STEPS = [
  { key: 'route', label: 'Mapping your route...' },
  { key: 'itinerary', label: 'Building your itinerary...' },
  { key: 'flights', label: 'Finding flight options...' },
  { key: 'hotels', label: 'Searching hotels...' },
  { key: 'transport', label: 'Planning inter-city transport...' },
  { key: 'budget', label: 'Calculating budget...' },
  { key: 'tips', label: 'Gathering travel tips...' },
  { key: 'packing', label: 'Creating packing list...' },
  { key: 'weather', label: 'Checking weather...' },
  { key: 'visa', label: 'Researching visa info...' },
  { key: 'currency', label: 'Getting currency data...' },
  { key: 'nearby', label: 'Finding nearby gems...' },
] as const;

export default function LoadingScreen({ destinations, progress }: Props) {
  const [destIndex, setDestIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [planeX, setPlaneX] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const doneCount = Object.values(progress).filter(Boolean).length;
  const totalCount = STEPS.length;
  const pct = totalCount > 0 ? (doneCount / totalCount) * 100 : 0;

  useEffect(() => {
    if (destinations.length === 0) return;
    let charIndex = 0;
    const target = destinations[destIndex];
    setDisplayText('');

    intervalRef.current = window.setInterval(() => {
      charIndex++;
      setDisplayText(target.slice(0, charIndex));
      if (charIndex >= target.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => {
          setDestIndex((prev) => (prev + 1) % destinations.length);
        }, 1200);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [destIndex, destinations]);

  useEffect(() => {
    let frame: number;
    let pos = 0;
    const animate = () => {
      pos = (pos + 0.3) % 110;
      setPlaneX(pos);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Animated plane */}
      <div className="relative h-16 mb-8 overflow-hidden">
        <div className="absolute text-5xl transition-none" style={{ left: `${planeX}%`, top: '50%', transform: 'translateY(-50%)' }}>
          ✈️
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Typewriter */}
      <h2 className="text-2xl font-bold text-white mb-2">
        Planning {displayText}
        <span className="animate-pulse text-[#FF6B35]">|</span>
      </h2>
      <p className="text-gray-500 mb-8">Crafting your perfect adventure</p>

      {/* Overall progress bar */}
      <div className="max-w-xs mx-auto mb-8">
        <div className="flex items-center justify-between mb-1">
          <span className="text-gray-500 text-xs">{doneCount} of {totalCount}</span>
          <span className="text-[#2D936C] text-xs font-bold">{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FF6B35] to-[#2D936C] transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2.5 text-left max-w-xs mx-auto">
        {STEPS.map((step) => {
          const done = progress[step.key as keyof typeof progress];
          return (
            <div key={step.key} className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {done ? (
                  <span className="text-[#2D936C] text-sm">✓</span>
                ) : (
                  <div className="w-3.5 h-3.5 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <span className={`text-xs ${done ? 'text-[#2D936C]' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
