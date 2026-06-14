"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import { useState } from "react";

const guides = [
  { title: "Morning Affirmations",   duration: "5 min",  icon: "🌅", category: "Mindset" },
  { title: "Planetary Meditation",   duration: "10 min", icon: "🪐", category: "Meditation" },
  { title: "Venus Love Ritual",      duration: "8 min",  icon: "❤️",  category: "Love" },
  { title: "Saturn Discipline Talk", duration: "12 min", icon: "⚖️", category: "Career" },
  { title: "Full Moon Release",      duration: "7 min",  icon: "🌕", category: "Healing" },
  { title: "Mercury Clarity Guide",  duration: "6 min",  icon: "💫", category: "Mindset" },
];

export default function VoiceGuidancePage() {
  const [playing, setPlaying] = useState(null);

  return (
    <PublicPageLayout
      eyebrow="Voice guidance"
      title="Call with Astrologer"
      description="Browse short voice-led guidance cards and start the flow that feels most relevant right now."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <div key={g.title} className="flex flex-col gap-3 rounded-[22px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_14px_32px_rgba(94,70,12,0.10)] transition hover:-translate-y-0.5 hover:border-[#d8ce76]">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{g.icon}</span>
              <span className="rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-2 py-1 text-[10px] font-bold text-[#8a6106]">
                {g.category}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-extrabold">{g.title}</h3>
              <p className="mt-0.5 text-xs font-medium text-[#6f5930]">Duration: {g.duration}</p>
            </div>

            <div className="flex items-center gap-0.5 h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    playing === g.title ? "bg-[#b88a00]" : "bg-[#ead783]"
                  }`}
                  style={{ height: `${20 + Math.sin(i * 0.8) * 14}px` }}
                />
              ))}
            </div>

            <button
              onClick={() => setPlaying(playing === g.title ? null : g.title)}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition ${
                playing === g.title
                  ? "bg-[#211704] text-white"
                  : "bg-[#dfff00] text-[#312d1e] hover:bg-[#cdf000]"
              }`}
            >
              {playing === g.title ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        ))}
      </div>
    </PublicPageLayout>
  );
}
