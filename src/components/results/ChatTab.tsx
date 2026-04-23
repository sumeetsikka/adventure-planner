import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TravelConfig, ChatMessage } from '../../types';

interface Props {
  config: TravelConfig;
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

export default function ChatTab({ config }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          country: config.country,
          destinations: config.destinations,
        }),
      });
      const data = await res.json();
      const answer = data.answer || data.error || 'Sorry, I could not answer that right now.';
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
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
          Anything about {countryName} — your destinations and dates already in hand.
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
              {SUGGESTIONS.slice(0, 4).map((s) => (
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
          className="flex-1 bg-[var(--ink-3)] border border-[var(--line)] rounded-full px-6 py-3.5 text-[var(--cream)] placeholder-[var(--text-dim)] text-[14px] font-display-soft italic focus:outline-none focus:border-[var(--gold)]/50 transition-colors disabled:opacity-50"
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
