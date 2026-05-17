"use client";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

export default function ChatPanel() {
  const { chatOpen, setChatOpen } = useApp();

  // ✅ ADDED: chat state
  const [messages, setMessages] = useState([
    { id: 1, sender: "astro", text: "Hello! How can I guide you today?" },
  ]);
  const [input, setInput] = useState("");

  // ✅ ADDED: send message
  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // ✅ Simulated reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "astro",
          text: "I see positive energy around this. Stay focused ✨",
        },
      ]);
    }, 1000);
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setChatOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-87.5 h-full bg-[#0f1535] p-4 border-l border-white/10 flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">Chat</h2>
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
              {msg.text}
            </div>
          ))}
        </div>

        {/* ✅ Input Box */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-purple-600 px-3 py-2 rounded-lg text-xs hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}