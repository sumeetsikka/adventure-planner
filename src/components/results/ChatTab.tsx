import { useState, useRef, useEffect } from 'react';
import type { TravelConfig, ChatMessage } from '../../types';

interface Props {
  config: TravelConfig;
}

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

  return (
    <div className="flex flex-col" style={{ minHeight: '500px' }}>
      <div className="mb-4">
        <h2 className="text-white font-bold text-xl mb-1">Travel Agent</h2>
        <p className="text-gray-500 text-sm">Ask me anything about {countryName}. I know your destinations and travel dates.</p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-[400px] pr-1">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3">🧑‍✈️</span>
            <p className="text-gray-400 text-sm mb-4">Hi! I'm your {countryName} travel expert. Ask me anything.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.slice(0, 4).map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-[11px] px-3 py-1.5 rounded-lg bg-[#131B2E] border border-white/8 text-gray-400 hover:text-white hover:border-white/15 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white'
                : 'bg-[#131B2E] border border-white/8 text-gray-300'
            }`}>
              {msg.role === 'assistant' && <span className="text-xs block mb-1 text-gray-500">🧑‍✈️ Travel Agent</span>}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#131B2E] border border-white/8 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions (after first message) */}
      {messages.length > 0 && messages.length < 6 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {SUGGESTIONS.filter(s => !messages.some(m => m.content === s)).slice(0, 3).map((s) => (
            <button key={s} onClick={() => sendMessage(s)} disabled={loading}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-500 hover:text-white hover:border-white/15 transition-all disabled:opacity-50">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 chat-input-fixed">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder={`Ask about ${countryName}...`}
          disabled={loading}
          className="flex-1 bg-[#131B2E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-[#FF6B35]/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            input.trim() && !loading
              ? 'bg-gradient-to-r from-[#FF6B35] to-[#E85D26] text-white hover:shadow-lg'
              : 'bg-white/5 text-gray-600 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
