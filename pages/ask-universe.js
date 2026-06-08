"use client";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const suggestions = [
  "What does my future hold?",
  "Will I find true love this year?",
  "Is this career path right for me?",
  "What should I focus on this month?",
];

const aiReply = (q) =>
  `The universe sees your question about "${q}". The stars align in your favour — trust the journey, stay grounded, and embrace the cosmic energy flowing toward you. ✨`;

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
    <PageLayout title="Ask the Universe (AI)" icon="🤖">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-h-[400px] max-h-[480px] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] text-sm px-4 py-2.5 rounded-2xl leading-relaxed ${
                m.role === "user"
                  ? "bg-purple-600 text-white rounded-br-sm"
                  : "bg-white/10 text-gray-200 rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 text-gray-400 text-sm px-4 py-2.5 rounded-2xl rounded-bl-sm">
                Consulting the stars<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            placeholder="Ask the universe anything..."
            className="flex-1 bg-[#0f1535]/80 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 text-white disabled:opacity-60"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-24"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Asking...
              </>
            ) : (
              "Ask ✨"
            )}
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
