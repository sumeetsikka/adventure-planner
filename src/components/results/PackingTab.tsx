import { useState } from 'react';
import type { PackingItem } from '../../types';

interface Props {
  packing: PackingItem[];
}

const CATEGORY_EMOJI: Record<string, string> = {
  Clothing: '👕',
  Toiletries: '🧴',
  Electronics: '🔌',
  Documents: '📄',
  Activities: '🎒',
};

function getCategoryEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '📦';
}

export default function PackingTab({ packing }: Props) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (packing.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🎒</span>
        <p className="text-white font-medium">Packing list is loading</p>
      </div>
    );
  }

  const totalItems = packing.reduce((sum, cat) => sum + cat.items.length, 0);
  const packedCount = checkedItems.size;
  const progressPct = totalItems > 0 ? (packedCount / totalItems) * 100 : 0;

  function toggleItem(category: string, item: string) {
    const key = `${category}-${item}`;
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Your Packing List</h2>
        <p className="text-gray-500 text-sm">Tick items off as you pack</p>
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl border border-white/8 bg-[#131B2E] p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">
            {packedCount} of {totalItems} items packed
          </span>
          <span className="text-[#2D936C] text-sm font-bold">{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2D936C] to-[#2D936C]/60 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Weight estimate */}
      {(() => {
        // Rough weight estimates per item category (kg per item average)
        const categoryWeights: Record<string, number> = {
          Clothing: 0.35, Toiletries: 0.15, Electronics: 0.4, Documents: 0.05, Activities: 0.5,
        };
        const defaultWeight = 0.2;
        const totalWeight = packing.reduce((sum, cat) => {
          const wPerItem = categoryWeights[cat.category] || defaultWeight;
          return sum + cat.items.length * wPerItem;
        }, 0);
        const roundedWeight = Math.round(totalWeight * 10) / 10;

        const AIRLINE_LIMITS = [
          { name: 'Jetstar', checked: 20, carry: 7 },
          { name: 'Qantas', checked: 23, carry: 7 },
          { name: 'Singapore Airlines', checked: 25, carry: 7 },
          { name: 'Vietnam Airlines', checked: 23, carry: 7 },
          { name: 'AirAsia', checked: 20, carry: 7 },
        ];

        return (
          <div className="rounded-2xl border border-white/8 bg-[#131B2E] p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Estimated Pack Weight</h3>
              <span className="text-[#E6A817] font-bold text-lg">{roundedWeight} kg</span>
            </div>

            <div className="space-y-2">
              {AIRLINE_LIMITS.map((airline) => {
                const pct = Math.min(100, (roundedWeight / airline.checked) * 100);
                const isOver = roundedWeight > airline.checked;
                return (
                  <div key={airline.name}>
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-gray-500">{airline.name} ({airline.checked}kg checked)</span>
                      <span className={isOver ? 'text-red-400 font-semibold' : 'text-[#2D936C]'}>
                        {isOver ? `${(roundedWeight - airline.checked).toFixed(1)}kg over!` : `${(airline.checked - roundedWeight).toFixed(1)}kg spare`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isOver ? 'bg-red-400' : 'bg-[#2D936C]'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-gray-600 text-[9px] mt-3">
              Weight is a rough estimate based on typical item weights. Check your airline's baggage policy before you fly.
            </p>
          </div>
        );
      })()}

      {/* Category cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packing.map((cat, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-[#131B2E] p-4 hover:border-white/15 hover:bg-[#182036] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{getCategoryEmoji(cat.category)}</span>
              <h4 className="text-white font-bold text-sm">{cat.category}</h4>
              <span className="ml-auto text-[10px] text-gray-600">
                {cat.items.filter((item) => checkedItems.has(`${cat.category}-${item}`)).length}/{cat.items.length}
              </span>
            </div>

            <ul className="space-y-1.5">
              {cat.items.map((item, j) => {
                const key = `${cat.category}-${item}`;
                const checked = checkedItems.has(key);
                return (
                  <li key={j}>
                    <label className="flex items-center gap-2.5 cursor-pointer group/item">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(cat.category, item)}
                        className="w-4 h-4 rounded accent-[#2D936C] shrink-0 cursor-pointer"
                      />
                      <span
                        className={`text-[13px] transition-all duration-200 ${
                          checked
                            ? 'line-through text-gray-600 opacity-50'
                            : 'text-gray-300 group-hover/item:text-white'
                        }`}
                      >
                        {item}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
