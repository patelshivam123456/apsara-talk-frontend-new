"use client";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const sessions = [
  { name: "Dr. Aryan Sharma", role: "Vedic Astrology", date: "Today, 4:00 PM", status: "upcoming" },
  { name: "Neha Iyer",        role: "Tarot Reading",   date: "Yesterday, 6:30 PM", status: "completed" },
  { name: "Astro Vihaan",     role: "Vedic Astrology", date: "May 10, 11:00 AM",   status: "completed" },
];

export default function ChatPage() {
  const [tab, setTab] = useState("sessions");

  return (
    <PageLayout title="Chat / Sessions" icon="💬">
      <div className="flex gap-2 mb-6">
        {["sessions", "messages"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-purple-600 text-white"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "sessions" && (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.name} className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/100" className="w-12 h-12 rounded-full border border-purple-500/30" />
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.role}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.date}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                s.status === "upcoming"
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}>
                {s.status === "upcoming" ? "Join Now" : "Completed"}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === "messages" && (
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-sm">No messages yet. Start a session with an astrologer.</p>
        </div>
      )}
    </PageLayout>
  );
}
