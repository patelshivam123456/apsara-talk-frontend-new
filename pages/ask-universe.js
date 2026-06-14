"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import { useState } from "react";

const suggestions = [
  "What does my future hold?",
  "Will I find true love this year?",
  "Is this career path right for me?",
  "What should I focus on this month?",
];

const aiReply = (q) =>
  `The universe sees your question about "${q}". The stars align in your favour. Trust the journey, stay grounded, and choose the next step with calm attention.`;

export default function AskUniversePage() {
  const [input, setInput]     = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste 🙏 I am the Cosmic AI. Ask me anything about your destiny, love, career, or life path." },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (q = input) => {
    if (loading || !q.trim()) return;
    const question = q.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: aiReply(question) }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <PublicPageLayout
      eyebrow="Intuitive clarity"
      title="Ask the Universe"
      description="Ask a focused question and receive a reflective answer for love, career, timing, or personal direction."
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-3 py-2 text-xs font-bold text-[#4d3f12] transition hover:bg-[#fff8a8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex min-h-[400px] max-h-[480px] flex-col gap-3 overflow-y-auto rounded-[24px] border border-[#eadcae] bg-white/92 p-4 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#211704] text-white"
                  : "rounded-bl-sm bg-[#fff8dc] text-[#60481f]"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-[#fff8dc] px-4 py-2.5 text-sm text-[#60481f]">
                Consulting the stars<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            placeholder="Ask the universe anything..."
            className="flex-1 rounded-xl border border-[#eadcae] bg-white px-4 py-3 text-sm text-[#211704] outline-none focus:border-[#d8ce76] disabled:opacity-60"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="flex min-w-24 items-center justify-center gap-2 rounded-xl bg-[#dfff00] px-5 py-3 text-sm font-bold text-[#312d1e] transition hover:bg-[#cdf000] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#312d1e]/30 border-t-[#312d1e]" />
                Asking...
              </>
            ) : (
              "Ask"
            )}
          </button>
        </div>
      </div>
    </PublicPageLayout>
  );
}
