import { useState } from 'react';
import type { Destination } from '../../types';

interface Props {
  destinations: Destination[];
}

export default function PhotosTab({ destinations }: Props) {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Destination Photos</h2>
        <p className="text-gray-500 text-sm">A visual preview of your selected destinations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {destinations.map((d) => {
          const hasFailed = failedImages.has(d.id);
          const imgUrl = `https://source.unsplash.com/800x500/?${encodeURIComponent(d.name)}+travel+landmark`;

          return (
            <div key={d.id} className="group relative rounded-2xl overflow-hidden border border-white/8 bg-[#131B2E] hover:border-white/15 transition-all duration-300">
              {hasFailed ? (
                <div className="h-48 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${d.colour}15, ${d.colour}05)` }}>
                  <span className="text-6xl">{d.emoji}</span>
                </div>
              ) : (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={d.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => handleError(d.id)}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{d.emoji}</span>
                  <h3 className="text-white font-bold text-sm">{d.name}</h3>
                </div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-2" style={{ color: d.colour }}>{d.region}</p>
                <div className="flex flex-wrap gap-1">
                  {d.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
