import type { VisaInfo } from '../../types';

interface Props {
  visa: VisaInfo | null;
}

function getStatusBadge(visa: VisaInfo): { label: string; className: string } {
  if (!visa.visa_required) {
    return {
      label: 'Visa Free',
      className: 'bg-green-500/15 text-green-400 border border-green-500/25',
    };
  }
  if (visa.visa_type.toLowerCase().includes('e-visa')) {
    return {
      label: 'E-Visa',
      className: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25',
    };
  }
  return {
    label: 'Visa Required',
    className: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
  };
}

export default function VisaTab({ visa }: Props) {
  if (!visa) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">📄</span>
        <p className="text-[var(--cream)] font-medium">Visa information is loading</p>
      </div>
    );
  }

  const badge = getStatusBadge(visa);

  const infoGrid = [
    { label: 'Visa Type', value: visa.visa_type },
    { label: 'Max Stay', value: visa.max_stay },
    { label: 'Processing Time', value: visa.processing_time },
    { label: 'Cost (AUD)', value: visa.cost_aud },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[var(--cream)] font-bold text-xl mb-1">Visa Requirements</h2>
        <p className="text-[var(--text-muted)] text-sm">For Australian passport holders</p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--ink-3)] p-6">
        {/* Status badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${badge.className}`}>
            {badge.label}
          </span>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {infoGrid.map((info, i) => (
            <div key={i} className="rounded-xl border border-[var(--line)] bg-white/[0.02] p-3">
              <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider mb-1">{info.label}</p>
              <p className="text-[var(--cream)] text-sm font-semibold leading-snug">{info.value}</p>
            </div>
          ))}
        </div>

        {/* Documents needed */}
        {visa.documents_needed.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[var(--cream)] font-bold text-sm mb-3">Documents Needed</h3>
            <ul className="space-y-2">
              {visa.documents_needed.map((doc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#7A9082] mt-0.5 shrink-0">•</span>
                  <span className="text-gray-300 text-sm">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* How to apply */}
        {visa.how_to_apply && (
          <div className="mb-6">
            <h3 className="text-[var(--cream)] font-bold text-sm mb-2">How to Apply</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{visa.how_to_apply}</p>
          </div>
        )}

        {/* Important notes */}
        {visa.important_notes.length > 0 && (
          <div>
            <h3 className="text-[var(--cream)] font-bold text-sm mb-3">Important Notes</h3>
            <div className="space-y-2">
              {visa.important_notes.map((note, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-xl bg-yellow-500/8 border border-yellow-500/20 px-3 py-2.5"
                >
                  <span className="text-yellow-400 shrink-0 mt-0.5">⚠️</span>
                  <p className="text-yellow-200/80 text-sm leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
