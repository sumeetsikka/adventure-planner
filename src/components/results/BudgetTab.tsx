import { useState } from 'react';
import type { BudgetItem, TravelConfig } from '../../types';
import { generateBudget } from '../../lib/api';

interface Props {
  budget: BudgetItem[];
  config: TravelConfig;
  onUpdate?: (budget: BudgetItem[]) => void;
}

function parseCostMid(cost: string): number {
  const nums = cost.match(/[\d,]+/g);
  if (!nums || nums.length === 0) return 0;
  const values = nums.map((n) => parseInt(n.replace(/,/g, '')));
  if (values.length === 1) return values[0];
  return Math.round((values[0] + values[1]) / 2);
}

const CATEGORY_ICONS: Record<string, string> = {
  flight: '✈️', flights: '✈️', international: '✈️', domestic: '🛫', internal: '🛫',
  hotel: '🏨', accommodation: '🏨', stay: '🏨',
  food: '🍜', drink: '🍜', meal: '🍜', dining: '🍜',
  activity: '🎯', tour: '🎯', activities: '🎯', cruise: '⛵', cave: '🦇', trek: '⛰️', snorkel: '🤿', cooking: '🍳', tailor: '✂️', canyoning: '🧗',
  transport: '🚕', grab: '🚕', taxi: '🚕', transfer: '🚕', motorbike: '🏍️', train: '🚂', ferry: '⛴️',
  visa: '📄', insurance: '🛡️', sim: '📱', souvenir: '🎁', miscellaneous: '🎁',
};

function getCategoryIcon(category: string): string {
  const lower = category.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '💰';
}

export default function BudgetTab({ budget, config, onUpdate }: Props) {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onUpdate) return;
    setRetrying(true);
    try {
      const result = await generateBudget(config);
      onUpdate(result);
    } catch (err) {
      console.error('Budget retry failed:', err);
    } finally {
      setRetrying(false);
    }
  };

  if (budget.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">💰</span>
        <p className="text-white font-medium mb-2">Budget not available yet</p>
        <p className="text-gray-500 text-sm mb-6">This can happen if the AI service was busy. Click below to try again.</p>
        {onUpdate && (
          <button onClick={handleRetry} disabled={retrying}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#FF6B35] to-[#E85D26] hover:shadow-lg transition-all disabled:opacity-50">
            {retrying ? 'Generating...' : 'Generate Budget'}
          </button>
        )}
      </div>
    );
  }

  const perPersonTotal = budget.reduce((sum, item) => sum + parseCostMid(item.cost), 0);
  const groupTotal = perPersonTotal * config.travellers;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Trip Budget</h2>
        <p className="text-gray-500 text-sm">Complete cost breakdown including flights, hotels, activities, and transport.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="rounded-2xl p-5 border border-[#2D936C]/20 bg-[#131B2E]">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Per Person</p>
          <p className="text-[#2D936C] text-3xl font-bold">${perPersonTotal.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">estimated total</p>
        </div>
        <div className="rounded-2xl p-5 border border-[#E6A817]/20 bg-[#131B2E]">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Group Total ({config.travellers} traveller{config.travellers > 1 ? 's' : ''})
          </p>
          <p className="text-[#E6A817] text-3xl font-bold">${groupTotal.toLocaleString()}</p>
          <p className="text-gray-500 text-xs mt-1">estimated total</p>
        </div>
      </div>

      {/* Budget cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {budget.map((item, i) => {
          const mid = parseCostMid(item.cost);
          const pct = perPersonTotal > 0 ? (mid / perPersonTotal) * 100 : 0;
          const icon = getCategoryIcon(item.category);
          const isSelected = selectedItem === i;

          return (
            <div key={i}
              onClick={() => setSelectedItem(isSelected ? null : i)}
              className={`group rounded-2xl p-4 border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-white/20 bg-[#182036] ring-1 ring-white/10'
                  : 'border-white/8 bg-[#131B2E] hover:border-white/15 hover:bg-[#182036] hover:-translate-y-0.5'
              }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-[#2D936C] font-bold text-base">{item.cost}</span>
              </div>

              <h4 className="text-white font-semibold text-sm mb-2 leading-snug">{item.category}</h4>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2D936C] to-[#2D936C]/40 transition-all duration-700"
                  style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <p className="text-gray-600 text-[9px]">{Math.round(pct)}% of budget</p>
            </div>
          );
        })}
      </div>

      <p className="text-gray-600 text-[10px] text-center mt-4">
        Estimates based on typical costs for Australian travellers. Actual prices vary by season and availability.
      </p>
    </div>
  );
}
