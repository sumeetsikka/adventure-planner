import { useState } from 'react';
import type { TravelConfig } from '../../types';

interface Props {
  config: TravelConfig;
}

const CHECKLIST_ITEMS = [
  { id: 'passport', icon: '🛂', label: 'Passport valid for 6+ months beyond travel dates', category: 'Documents' },
  { id: 'visa', icon: '📄', label: 'Visa applied for or requirements checked', category: 'Documents' },
  { id: 'insurance', icon: '🛡️', label: 'Travel insurance purchased (comprehensive cover)', category: 'Documents' },
  { id: 'flights', icon: '✈️', label: 'All flights booked (international + domestic)', category: 'Bookings' },
  { id: 'hotels', icon: '🏨', label: 'Hotels booked for all destinations', category: 'Bookings' },
  { id: 'transfers', icon: '🚕', label: 'Airport transfers arranged', category: 'Bookings' },
  { id: 'tours', icon: '🎯', label: 'Tours and activities pre-booked where needed', category: 'Bookings' },
  { id: 'bank', icon: '🏦', label: 'Bank notified of travel dates (avoid card blocks)', category: 'Money' },
  { id: 'currency', icon: '💱', label: 'Local currency or travel card arranged', category: 'Money' },
  { id: 'sim', icon: '📱', label: 'SIM card or roaming plan sorted', category: 'Tech' },
  { id: 'apps', icon: '📲', label: 'Offline maps and translation apps downloaded', category: 'Tech' },
  { id: 'copies', icon: '📋', label: 'Document copies saved digitally (passport, insurance, bookings)', category: 'Safety' },
  { id: 'emergency', icon: '🆘', label: 'Emergency contacts shared with family/friends', category: 'Safety' },
  { id: 'vaccinations', icon: '💉', label: 'Vaccinations checked with travel doctor', category: 'Health' },
  { id: 'medications', icon: '💊', label: 'Prescriptions and basic meds packed', category: 'Health' },
  { id: 'packing', icon: '🧳', label: 'Packing complete (see Packing tab)', category: 'Packing' },
  { id: 'home', icon: '🏠', label: 'Home arrangements sorted (mail, pets, plants)', category: 'Home' },
  { id: 'chargers', icon: '🔌', label: 'Power adapter for destination country', category: 'Tech' },
];

export default function ChecklistTab({ config }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = CHECKLIST_ITEMS.length;
  const done = checked.size;
  const pct = total > 0 ? (done / total) * 100 : 0;

  // Group by category
  const categories = Array.from(new Set(CHECKLIST_ITEMS.map((i) => i.category)));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Pre-Departure Checklist</h2>
        <p className="text-gray-500 text-sm">
          {config.country?.name} trip preparation. Tick items off as you complete them.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border border-white/8 bg-[#131B2E] p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold text-sm">{done} of {total} complete</span>
          <span className="text-[#2D936C] font-bold text-sm">{Math.round(pct)}%</span>
        </div>
        <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#2D936C] to-[#2D936C]/50 transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        {done === total && (
          <p className="text-[#2D936C] text-xs mt-2 font-semibold">All done. You're ready to go! 🎉</p>
        )}
      </div>

      {/* Checklist by category */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.category === cat);
          return (
            <div key={cat} className="rounded-2xl border border-white/8 bg-[#131B2E] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/5">
                <h3 className="text-white font-semibold text-sm">{cat}</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <button key={item.id} type="button" onClick={() => toggle(item.id)}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-white/[0.02] transition-colors">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isChecked ? 'bg-[#2D936C] border-[#2D936C]' : 'border-white/20'
                      }`}>
                        {isChecked && <span className="text-white text-[10px]">✓</span>}
                      </div>
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      <span className={`text-sm transition-all ${
                        isChecked ? 'text-gray-600 line-through' : 'text-gray-300'
                      }`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
