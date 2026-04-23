import { motion } from 'framer-motion';
import type { VisaInfo } from '../../types';

interface Props {
  visa: VisaInfo | null;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function getStatusLabel(visa: VisaInfo): string {
  if (!visa.visa_required) return 'Visa Free';
  if (visa.visa_type.toLowerCase().includes('e-visa')) return 'E-Visa';
  return 'Visa Required';
}

export default function VisaTab({ visa }: Props) {
  if (!visa) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Papers</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Gathering your <span className="text-[var(--gold)]">documents</span>…</p>
      </div>
    );
  }

  const status = getStatusLabel(visa);

  const infoGrid = [
    { label: 'Visa Type', value: visa.visa_type },
    { label: 'Max Stay', value: visa.max_stay },
    { label: 'Processing', value: visa.processing_time },
    { label: 'Cost (AUD)', value: visa.cost_aud },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="mb-10">
        <p className="eyebrow mb-3">Chapter II — Entry</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Papers &amp; <span className="italic text-[var(--gold)]">passage</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">For Australian passport holders.</p>
      </div>

      <div className="surface-card rounded-3xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] text-[11px] font-medium tracking-[0.18em] uppercase">
            {status}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {infoGrid.map((info, i) => (
            <div key={i} className="border-l border-[var(--line-strong)] pl-4">
              <p className="eyebrow mb-2">{info.label}</p>
              <p className="font-display text-lg text-[var(--cream)] leading-snug">{info.value}</p>
            </div>
          ))}
        </div>

        {visa.documents_needed.length > 0 && (
          <div className="mb-10">
            <p className="eyebrow mb-4">Documents Needed</p>
            <ul className="space-y-3">
              {visa.documents_needed.map((doc, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--cream)] text-[15px] leading-relaxed">
                  <span className="text-[var(--gold)] mt-1.5 shrink-0">—</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {visa.how_to_apply && (
          <div className="mb-10">
            <p className="eyebrow mb-3">How to Apply</p>
            <p className="font-display-soft text-[var(--cream)] text-lg leading-relaxed italic">{visa.how_to_apply}</p>
          </div>
        )}

        {visa.important_notes.length > 0 && (
          <div>
            <p className="eyebrow mb-4">Important Notes</p>
            <div className="space-y-3">
              {visa.important_notes.map((note, i) => (
                <div
                  key={i}
                  className="rounded-2xl border-l-2 border-[var(--terracotta)] bg-[var(--ink-3)] px-5 py-4"
                >
                  <p className="text-[var(--cream)] text-[14px] leading-relaxed italic font-display-soft">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
