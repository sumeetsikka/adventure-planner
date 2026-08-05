import { motion } from 'framer-motion';
import type { VisaInfo } from '../../types';
import { mapsUrl, telUrl } from '../../lib/deepLinks';
import { EstimateNote } from '../shared/EstimateBadge';
import { getEmergencyNumbers } from '../../lib/emergency';

interface Props {
  visa: VisaInfo | null;
  travellers?: number;
  departureDate?: string;
  /** Country id — resolves the CURATED emergency number. The visa payload is
   *  LLM-generated, and an invented emergency number rendered as tap-to-call is
   *  not a risk worth taking when a hand-checked dataset already exists. */
  countryId?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function getStatusLabel(visa: VisaInfo): string {
  if (!visa.visa_required) return 'Visa Free';
  const visaType = (visa.visa_type || '').toLowerCase();
  if (visaType.includes('e-visa') || visaType.includes('evisa')) return 'E-Visa';
  return 'Visa Required';
}

// Parse a cost like "$50", "AUD 50", "50 AUD", "Free", "$30-50" → number per person.
function parseCostAud(raw: string | undefined): number | null {
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes('free')) return 0;
  const nums = raw.match(/\d+(?:\.\d+)?/g);
  if (!nums || nums.length === 0) return null;
  // For a range, take the upper bound.
  const parsed = nums.map((n) => parseFloat(n));
  return Math.max(...parsed);
}

// Compute "passport must be valid until" date given departure + required months.
function passportValidUntil(departureDate: string | undefined, months: number): string | null {
  if (!departureDate) return null;
  const d = new Date(departureDate);
  if (isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function VaxBadge({ rec }: { rec: 'required' | 'recommended' | 'consider' }) {
  const map = {
    required: { label: 'Required', cls: 'border-[var(--terracotta)]/60 text-[var(--terracotta)]' },
    recommended: { label: 'Recommended', cls: 'border-[var(--gold)]/50 text-[var(--gold)]' },
    consider: { label: 'Consider', cls: 'border-[var(--line-strong)] text-[var(--text-muted)]' },
  } as const;
  const cfg = map[rec] || map.consider;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border ${cfg.cls} text-[10px] font-medium tracking-[0.16em] uppercase`}>
      {cfg.label}
    </span>
  );
}

export default function VisaTab({ visa, travellers = 1, departureDate, countryId }: Props) {
  // Curated, hand-checked — never the LLM's guess (falls back to GSM-universal 112).
  const emergency = getEmergencyNumbers(countryId);
  const emergencyNumber = emergency.general || emergency.police;
  if (!visa) {
    return (
      <div className="text-center py-24">
        <p className="eyebrow mb-4">Papers</p>
        <p className="font-display text-2xl italic text-[var(--cream)]">Gathering your <span className="text-[var(--gold)]">documents</span>…</p>
      </div>
    );
  }

  const status = getStatusLabel(visa);
  const statusToneClass = visa.visa_required
    ? 'border-[var(--gold)]/40 text-[var(--gold)]'
    : 'border-[var(--sage)]/40 text-[var(--sage)]';

  const perPersonCost = parseCostAud(visa.cost_aud);
  const groupCost = perPersonCost != null && travellers > 1 ? perPersonCost * travellers : null;

  const passportMonths = visa.passport_validity_required_months ?? 6;
  const passportUntil = passportValidUntil(departureDate, passportMonths);

  const quickStats = [
    { label: 'Max stay', value: visa.max_stay },
    { label: 'Processing', value: visa.processing_time },
    {
      label: travellers > 1 ? `Cost · per person` : 'Cost',
      value: visa.cost_aud,
      sub: groupCost != null ? `≈ A$${groupCost.toFixed(0)} for ${travellers}` : undefined,
    },
  ];

  const embassyMapQuery = visa.embassy?.address || (visa.embassy?.city ? `Australian Embassy ${visa.embassy.city}` : null);

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
        <p className="text-[var(--text-muted)] text-sm max-w-xl">For Australian passport holders bound for {visa.country}.</p>
      </div>

      {/* Status + quick stats */}
      <div className="surface-card rounded-3xl p-8 mb-6">
        <div className="flex items-center gap-3 mb-7 flex-wrap">
          <span className={`inline-flex items-center px-4 py-2 rounded-full border ${statusToneClass} text-[11px] font-medium tracking-[0.18em] uppercase`}>
            {status}
          </span>
          <span className="font-display-soft italic text-[var(--text-muted)] text-sm">{visa.visa_type}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {quickStats.map((stat, i) => (
            <div key={i} className="border-l border-[var(--line-strong)] pl-4">
              <p className="eyebrow mb-2">{stat.label}</p>
              <p className="font-display text-lg text-[var(--cream)] leading-snug">{stat.value}</p>
              {stat.sub && (
                <p className="font-display-soft italic text-[var(--text-muted)] text-xs mt-1">{stat.sub}</p>
              )}
            </div>
          ))}
        </div>

        {visa.evisa_url && (
          <div className="mt-8 pt-7 border-t border-[var(--line)]">
            <a
              href={visa.evisa_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--gold)] text-[var(--ink)] text-sm font-medium tracking-wide hover:opacity-90 transition"
            >
              Apply for e-visa
              <span aria-hidden>→</span>
            </a>
            {/* Never call this link "official" — `evisa_url` is AI-generated and
                unverified, and visa-scam sites are an active industry. Tell the
                user to confirm the destination before entering any details. */}
            <p className="font-display-soft italic text-[var(--text-muted)] text-xs mt-3">
              AI-suggested link — check it's the government site before entering personal details or paying.
            </p>
          </div>
        )}
      </div>

      {/* Passport readiness */}
      <div className="surface-soft rounded-3xl p-7 mb-6">
        <p className="eyebrow mb-4">Passport readiness</p>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-[var(--gold)] mt-1 shrink-0">◇</span>
            <div>
              <p className="text-[var(--cream)] text-[15px] leading-relaxed">
                Valid for at least <span className="italic text-[var(--gold)]">{passportMonths} months</span> beyond entry.
              </p>
              {passportUntil && (
                <p className="font-display-soft italic text-[var(--text-muted)] text-sm mt-1">
                  Your passport must be valid until <span className="text-[var(--cream)] not-italic">{passportUntil}</span>.
                </p>
              )}
            </div>
          </div>
          {visa.blank_pages_required != null && (
            <div className="flex items-start gap-3">
              <span className="text-[var(--gold)] mt-1 shrink-0">◇</span>
              <p className="text-[var(--cream)] text-[15px] leading-relaxed">
                <span className="italic text-[var(--gold)]">{visa.blank_pages_required}</span> blank page{visa.blank_pages_required === 1 ? '' : 's'} required for entry stamps.
              </p>
            </div>
          )}
          {visa.onward_ticket_required != null && (
            <div className="flex items-start gap-3">
              <span className="text-[var(--gold)] mt-1 shrink-0">◇</span>
              <p className="text-[var(--cream)] text-[15px] leading-relaxed">
                Onward ticket {visa.onward_ticket_required ? <span className="italic text-[var(--gold)]">required</span> : <span className="italic text-[var(--sage)]">not required</span>} at the border.
              </p>
            </div>
          )}
          {visa.exit_fee_aud && (
            <div className="flex items-start gap-3">
              <span className="text-[var(--gold)] mt-1 shrink-0">◇</span>
              <p className="text-[var(--cream)] text-[15px] leading-relaxed">
                Exit fee — <span className="italic text-[var(--gold)]">{visa.exit_fee_aud}</span>{travellers > 1 ? <span className="text-[var(--text-muted)] text-xs"> · payable per traveller</span> : null}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Embassy contact */}
      {visa.embassy && (
        <div className="surface-soft rounded-3xl p-7 mb-6">
          <p className="eyebrow mb-4">Australian Embassy {visa.embassy.city ? `· ${visa.embassy.city}` : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
            {visa.embassy.address && (
              <div className="sm:col-span-2">
                <p className="eyebrow mb-1">Address</p>
                <p className="text-[var(--cream)] leading-relaxed">{visa.embassy.address}</p>
              </div>
            )}
            {visa.embassy.phone && (
              <div>
                <p className="eyebrow mb-1">Phone</p>
                <a href={telUrl(visa.embassy.phone)} className="text-[var(--gold)] hover:underline italic font-display-soft">{visa.embassy.phone}</a>
              </div>
            )}
            {visa.embassy.email && (
              <div>
                <p className="eyebrow mb-1">Email</p>
                <a href={`mailto:${visa.embassy.email}`} className="text-[var(--gold)] hover:underline italic font-display-soft">{visa.embassy.email}</a>
              </div>
            )}
            {visa.embassy.website && (
              <div>
                <p className="eyebrow mb-1">Website</p>
                <a href={visa.embassy.website} target="_blank" rel="noopener noreferrer" className="text-[var(--gold)] hover:underline italic font-display-soft break-all">{visa.embassy.website}</a>
              </div>
            )}
          </div>
          {embassyMapQuery && (
            <div className="mt-5 pt-5 border-t border-[var(--line)]">
              <a
                href={mapsUrl(embassyMapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[var(--gold)] text-sm hover:underline"
              >
                <span aria-hidden>•</span>
                View on map
              </a>
            </div>
          )}
        </div>
      )}

      {/* Emergency contacts */}
      {(emergencyNumber || visa.embassy?.phone) && (
        <div className="surface-soft rounded-3xl p-7 mb-6">
          <p className="eyebrow mb-4">In an emergency</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {emergencyNumber && (
              <a
                href={telUrl(emergencyNumber)}
                className="flex items-center gap-4 rounded-2xl border border-[var(--terracotta)]/40 bg-[var(--ink-3)] px-5 py-4 hover:bg-[var(--ink-2)] transition"
              >
                <span className="text-2xl text-[var(--terracotta)]" aria-hidden>☎</span>
                <div>
                  <p className="eyebrow mb-1">Local emergency</p>
                  <p className="font-display text-xl text-[var(--cream)] leading-none">{emergencyNumber}</p>
                </div>
              </a>
            )}
            {visa.embassy?.phone && (
              <a
                href={telUrl(visa.embassy.phone)}
                className="flex items-center gap-4 rounded-2xl border border-[var(--gold)]/30 bg-[var(--ink-3)] px-5 py-4 hover:bg-[var(--ink-2)] transition"
              >
                <span className="text-2xl text-[var(--gold)]" aria-hidden>☎</span>
                <div>
                  <p className="eyebrow mb-1">Australian Embassy</p>
                  <p className="font-display text-xl text-[var(--cream)] leading-none">{visa.embassy.phone}</p>
                </div>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Vaccinations */}
      {visa.vaccinations && visa.vaccinations.length > 0 && (
        <div className="surface-soft rounded-3xl p-7 mb-6">
          <p className="eyebrow mb-4">Vaccinations</p>
          <ul className="flex flex-wrap gap-2.5">
            {visa.vaccinations.map((v, i) => (
              <li key={i} className="flex items-center gap-2 rounded-2xl bg-[var(--ink-3)] border border-[var(--line)] px-3.5 py-2">
                <span className="text-[var(--cream)] text-sm">{v.name}</span>
                <VaxBadge rec={v.recommendation} />
              </li>
            ))}
          </ul>
          <p className="font-display-soft italic text-[var(--text-muted)] text-xs mt-4">Consult your <span className="text-[var(--cream)] not-italic">GP or travel clinic</span> 6–8 weeks before departure.</p>
        </div>
      )}

      {/* Documents needed + how to apply + important notes */}
      <div className="surface-card rounded-3xl p-8">
        {visa.documents_needed && visa.documents_needed.length > 0 && (
          <div className="mb-10">
            <p className="eyebrow mb-4">Documents needed</p>
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
            <p className="eyebrow mb-3">How to apply</p>
            <p className="font-display-soft text-[var(--cream)] text-lg leading-relaxed italic">{visa.how_to_apply}</p>
          </div>
        )}

        {visa.important_notes && visa.important_notes.length > 0 && (
          <div>
            <p className="eyebrow mb-4">Important notes</p>
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

      {/* Entry rules are the highest-consequence thing the model guesses at —
          getting this wrong means being refused boarding. */}
      <EstimateNote what="visa and entry requirements" />
    </motion.div>
  );
}
