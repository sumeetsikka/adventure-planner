import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TravelConfig, ChatMessage, ChatAction, GenerationResults } from '../../types';
import { generateActivityAlternatives, generateRestaurantAlternatives, generateHotelAlternatives } from '../../lib/api';

interface Props {
  config: TravelConfig;
  /** When provided, the concierge can EDIT the plan (remove items, swap your
   *  hotel pick, fetch more options) — applied through the same plumbing as the
   *  Hotels/Do/Taste tabs. Without it, chat is answer-only. */
  results?: GenerationResults;
  onUpdateResults?: (partial: Partial<GenerationResults>) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const SUGGESTIONS = [
  'Is it safe to walk around at night?',
  'What should I definitely NOT miss?',
  'Best street food to try?',
  'Do I need any vaccinations?',
  'What scams should I watch out for?',
  'How much should I tip?',
  'What is the best way to get around?',
  'What should I wear to temples?',
];

// Suggestions that demonstrate the concierge can EDIT the plan.
const ACTION_SUGGESTIONS = [
  'Show me more places to eat',
  'Find me more things to do',
  'Show me other hotel options',
];

export default function ChatTab({ config, results, onUpdateResults }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // The concierge can act on the plan only when wired with results + updater.
  const canAct = !!(results && onUpdateResults);

  // Build the compact inventory the intent parser needs to resolve fuzzy
  // references ("the museum", "my Hanoi hotel") to exact names in the plan.
  const buildInventory = () => {
    if (!results) return undefined;
    const destinations = (config.destinations || []).map((d) => d.name);
    const hotels: Record<string, string[]> = {};
    const activities: Record<string, string[]> = {};
    const restaurants: Record<string, string[]> = {};
    for (const h of results.hotels || []) hotels[h.destination] = (h.hotels || []).map((x) => x.name);
    for (const a of results.activities || []) activities[a.destination] = (a.activities || []).map((x) => x.name);
    for (const r of results.restaurants || []) restaurants[r.destination] = (r.restaurants || []).map((x) => x.name);
    // Use the union of destination names that actually appear, so the parser
    // sees every editable bucket even if the itinerary names differ slightly.
    const allDest = Array.from(new Set([
      ...destinations,
      ...Object.keys(hotels), ...Object.keys(activities), ...Object.keys(restaurants),
    ]));
    return { destinations: allDest, hotels, activities, restaurants };
  };

  // Apply a classified action to the plan via the existing onUpdate plumbing.
  // Returns a status string appended to the concierge's reply, or '' if nothing
  // happened (e.g. kind 'none').
  const applyAction = async (action: ChatAction): Promise<string> => {
    if (!canAct || !results || !onUpdateResults) return '';
    switch (action.kind) {
      case 'remove_activity': {
        const next = (results.activities || []).map((d) =>
          d.destination === action.destination
            ? { ...d, activities: (d.activities || []).filter((x) => x.name !== action.name) }
            : d
        );
        onUpdateResults({ activities: next });
        return '';
      }
      case 'remove_restaurant': {
        const next = (results.restaurants || []).map((d) =>
          d.destination === action.destination
            ? { ...d, restaurants: (d.restaurants || []).filter((x) => x.name !== action.name) }
            : d
        );
        onUpdateResults({ restaurants: next });
        return '';
      }
      case 'pick_hotel': {
        const next = (results.hotels || []).map((d) =>
          d.destination === action.destination
            ? { ...d, hotels: (d.hotels || []).map((h) => ({ ...h, recommended: h.name === action.name })) }
            : d
        );
        onUpdateResults({ hotels: next });
        return '';
      }
      case 'more_activities': {
        const block = (results.activities || []).find((d) => d.destination === action.destination);
        if (!block) return ' (Couldn\'t find that destination.)';
        const fresh = await generateActivityAlternatives(config, {
          destination: action.destination,
          exclude: (block.activities || []).map((x) => x.name),
        });
        if (!fresh?.length) return ' (No new ideas came back.)';
        const next = (results.activities || []).map((d) =>
          d.destination === action.destination ? { ...d, activities: [...(d.activities || []), ...fresh] } : d
        );
        onUpdateResults({ activities: next });
        return ` Added ${fresh.length} new ideas in ${action.destination}.`;
      }
      case 'more_restaurants': {
        const block = (results.restaurants || []).find((d) => d.destination === action.destination);
        if (!block) return ' (Couldn\'t find that destination.)';
        const fresh = await generateRestaurantAlternatives(config, {
          destination: action.destination,
          exclude: (block.restaurants || []).map((x) => x.name),
        });
        if (!fresh?.length) return ' (No new spots came back.)';
        const next = (results.restaurants || []).map((d) =>
          d.destination === action.destination ? { ...d, restaurants: [...(d.restaurants || []), ...fresh] } : d
        );
        onUpdateResults({ restaurants: next });
        return ` Added ${fresh.length} new places in ${action.destination}.`;
      }
      case 'more_hotels': {
        const block = (results.hotels || []).find((d) => d.destination === action.destination);
        if (!block) return ' (Couldn\'t find that destination.)';
        const fresh = await generateHotelAlternatives(config, {
          destination: action.destination,
          check_in: block.check_in,
          check_out: block.check_out,
          nights: block.nights,
          exclude: (block.hotels || []).map((x) => x.name),
        });
        if (!fresh?.length) return ' (No new options came back.)';
        const next = (results.hotels || []).map((d) =>
          d.destination === action.destination
            ? { ...d, hotels: [...(d.hotels || []), ...fresh.map((h) => ({ ...h, recommended: false }))] }
            : d
        );
        onUpdateResults({ hotels: next });
        return ` Added ${fresh.length} more hotels in ${action.destination}.`;
      }
      default:
        return '';
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Abort any in-flight chat request when the user navigates away from the
  // tab — prevents an orphaned setState after unmount + saves the user from
  // a useless background request continuing to consume LLM tokens.
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Replace any prior in-flight request — only the latest user message wins.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // When the concierge can act, route through the intent parser with the
      // plan inventory; otherwise fall back to plain Q&A.
      const endpoint = canAct ? '/api/chatAction' : '/api/chat';
      const body = canAct
        ? { question: question.trim(), country: config.country, inventory: buildInventory() }
        : { question: question.trim(), country: config.country, destinations: config.destinations };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await res.json();
      let answer = data.answer || data.error || 'Sorry, I could not answer that right now.';

      // Apply any plan-editing action the concierge returned.
      if (canAct && data.action && data.action.kind && data.action.kind !== 'none') {
        try {
          const status = await applyAction(data.action as ChatAction);
          if (status) answer += status;
        } catch {
          answer += ' (I couldn\'t apply that change — please try from the tab.)';
        }
      }

      if (controller.signal.aborted) return;
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch (err) {
      // Aborts are intentional — don't surface a fake error message.
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const countryName = config.country?.name || 'your destination';

  const splitFirstLine = (content: string): { first: string; rest: string } => {
    const idx = content.indexOf('\n');
    if (idx === -1 || idx > 160) {
      const period = content.indexOf('. ');
      if (period > -1 && period < 140) {
        return { first: content.slice(0, period + 1), rest: content.slice(period + 2) };
      }
      return { first: content, rest: '' };
    }
    return { first: content.slice(0, idx), rest: content.slice(idx + 1) };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex flex-col"
      style={{ minHeight: '560px' }}
    >
      <div className="mb-8">
        <p className="eyebrow mb-3">Chapter VIII — Correspondence</p>
        <h2 className="font-display text-4xl sm:text-5xl text-[var(--cream)] leading-tight">
          Ask the <span className="italic text-[var(--gold)]">concierge</span>
        </h2>
        <div className="divider my-5 max-w-[120px]" />
        <p className="text-[var(--text-muted)] text-sm max-w-xl">
          {canAct
            ? `Ask anything about ${countryName} — or tell me to change your plan: "remove the museum in Hanoi", "show me more places to eat", "swap my hotel".`
            : `Anything about ${countryName} — your destinations and dates already in hand.`}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 mb-5 overflow-y-auto max-h-[460px] pr-1">
        {messages.length === 0 && (
          <div className="surface-soft rounded-3xl p-10 text-center">
            <p className="eyebrow mb-4">A note from the desk</p>
            <p className="font-display italic text-2xl text-[var(--cream)] mb-6 leading-snug">
              Good day. I know {countryName} — <br className="hidden sm:block" />
              what would you like to know?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {(canAct ? [...ACTION_SUGGESTIONS, SUGGESTIONS[0]] : SUGGESTIONS.slice(0, 4)).map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-[12px] px-4 py-2 rounded-full border border-[var(--line-strong)] text-[var(--cream)] hover:border-[var(--gold)]/50 hover:text-[var(--gold)] transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] rounded-3xl rounded-tr-md px-5 py-3 bg-[var(--cream)] text-[var(--ink)]">
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-display-soft">{msg.content}</p>
                  </div>
                </motion.div>
              );
            }
            const { first, rest } = splitFirstLine(msg.content);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex justify-start"
              >
                <div className="max-w-[85%] surface-soft rounded-3xl rounded-tl-md px-6 py-5">
                  <p className="eyebrow mb-2">Concierge</p>
                  <p className="font-display text-xl text-[var(--cream)] leading-snug mb-2">{first}</p>
                  {rest && (
                    <p className="text-[var(--text-muted)] text-[14px] leading-relaxed whitespace-pre-wrap">{rest}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="surface-soft rounded-3xl rounded-tl-md px-6 py-4">
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-1.5 h-1.5 bg-[var(--gold)] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length > 0 && messages.length < 6 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTIONS.filter((s) => !messages.some((m) => m.content === s))
            .slice(0, 3)
            .map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--line)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/40 transition-all disabled:opacity-50"
              >
                {s}
              </button>
            ))}
        </div>
      )}

      {/* Input bar */}
      <div className="flex gap-2 chat-input-fixed">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={`Ask about ${countryName}…`}
          disabled={loading}
          className="flex-1 bg-[var(--ink-4)] border border-[var(--line)] rounded-full px-6 py-3.5 text-[var(--cream)] placeholder-[var(--text-dim)] text-[14px] font-display-soft italic focus:outline-none focus:border-[var(--gold)]/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className={`px-7 py-3.5 rounded-full font-medium text-[12px] tracking-[0.18em] uppercase transition-all ${
            input.trim() && !loading
              ? 'bg-[var(--cream)] text-[var(--ink)] hover:bg-[var(--gold)]'
              : 'bg-[var(--ink-3)] text-[var(--text-dim)] cursor-not-allowed border border-[var(--line)]'
          }`}
        >
          Send
        </button>
      </div>
    </motion.div>
  );
}
