"use client";
import PageLayout from "@/components/PageLayout";
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
    <PageLayout title="Voice Guidance" icon="🎙️">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {guides.map((g) => (
          <div key={g.title} className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-purple-500/30 transition">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{g.icon}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300">
                {g.category}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{g.title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Duration: {g.duration}</p>
            </div>

            {/* Fake waveform */}
            <div className="flex items-center gap-0.5 h-6">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    playing === g.title ? "bg-purple-500" : "bg-white/20"
                  }`}
                  style={{ height: `${20 + Math.sin(i * 0.8) * 14}px` }}
                />
              ))}
            </div>

            <button
              onClick={() => setPlaying(playing === g.title ? null : g.title)}
              className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
                playing === g.title
                  ? "bg-purple-700 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {playing === g.title ? "⏸ Pause" : "▶ Play"}
            </button>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
