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
