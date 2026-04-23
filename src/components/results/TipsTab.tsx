import { useState } from 'react';
import type { Tip } from '../../types';

interface Props {
  tips: Tip[];
}

export default function TipsTab({ tips }: Props) {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  if (tips.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">📋</span>
        <p className="text-[var(--cream)] font-medium">Tips are loading</p>
      </div>
    );
  }

  const selected = selectedTip !== null ? tips[selectedTip] : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Travel Tips</h2>
        <p className="text-[var(--text-muted)] text-sm">Practical advice for your adventure. Tap any tip for the full detail.</p>
      </div>

      {/* Detail overlay */}
      {selected && (
        <div className="mb-6 animate-fade-up">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selected.icon}</span>
                <h3 className="text-[var(--cream)] font-bold text-lg">{selected.title}</h3>
              </div>
              <button onClick={() => setSelectedTip(null)}
                className="text-[var(--text-muted)] hover:text-[var(--cream)] text-xl w-8 h-8 rounded-lg hover:bg-[var(--ink-3)] flex items-center justify-center transition-colors">×</button>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">{selected.text}</p>
          </div>
        </div>
      )}

      {/* Tips cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tips.map((tip, i) => {
          const isSelected = selectedTip === i;

          return (
            <div key={i}
              onClick={() => setSelectedTip(isSelected ? null : i)}
              className={`group rounded-2xl p-5 border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'border-white/20 bg-[var(--ink-4)] ring-1 ring-white/10'
                  : 'border-[var(--line)] bg-[var(--ink-3)] hover:border-[var(--line-strong)] hover:bg-[var(--ink-4)] hover:-translate-y-0.5 hover:shadow-lg'
              }`}>
              <span className="text-3xl block mb-3">{tip.icon}</span>
              <h4 className="text-[var(--cream)] font-bold text-sm mb-2">{tip.title}</h4>
              <p className="text-[var(--text-muted)] text-[12px] leading-relaxed line-clamp-2">{tip.text}</p>
              <div className="mt-3 pt-2 border-t border-[var(--line)] flex items-center justify-between">
                <span className="text-[9px] text-[var(--text-dim)] group-hover:text-[var(--text-muted)] transition-colors">Tap to read</span>
                <span className="text-[var(--text-dim)] text-[10px] group-hover:text-[var(--text-muted)] transition-colors">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
