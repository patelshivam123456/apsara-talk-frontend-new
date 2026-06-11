"use client";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function ChatPanel() {
  const { chatOpen, setChatOpen } = useApp();
  const { t } = useLanguage();

  // ✅ ADDED: chat state
  const [messages, setMessages] = useState([
    { id: 1, sender: "astro", textKey: "chat.hello" },
  ]);
  const [input, setInput] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // ✅ ADDED: send message
  const handleSend = () => {
    if (isReplying || !input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsReplying(true);

    // ✅ Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "astro",
          textKey: "chat.reply",
        },
      ]);
      setIsReplying(false);
    }, 1000);
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={() => setChatOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-87.5 h-full bg-[#0f1535] p-4 border-l border-white/10 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">{t("chat.title")}</h2>
          <button
            onClick={() => setChatOpen(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ✅ Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-xs px-3 py-2 rounded-lg max-w-[75%]
                ${
                  msg.sender === "user"
                    ? "ml-auto bg-purple-600 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
            >
              {msg.textKey ? t(msg.textKey) : msg.text}
            </div>
          ))}
        </div>

        {/* ✅ Input Box */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chat.placeholder")}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isReplying}
          />

          <button
            onClick={handleSend}
            disabled={isReplying || !input.trim()}
            className="bg-purple-600 px-3 py-2 rounded-lg text-xs hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed min-w-16 flex items-center justify-center"
          >
            {isReplying ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              t("chat.send")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
