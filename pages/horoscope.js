"use client";
import PageLayout from "@/components/PageLayout";
import { useState } from "react";

const signs = [
  { name: "Aries",       symbol: "♈", dates: "Mar 21 – Apr 19" },
  { name: "Taurus",      symbol: "♉", dates: "Apr 20 – May 20" },
  { name: "Gemini",      symbol: "♊", dates: "May 21 – Jun 20" },
  { name: "Cancer",      symbol: "♋", dates: "Jun 21 – Jul 22" },
  { name: "Leo",         symbol: "♌", dates: "Jul 23 – Aug 22" },
  { name: "Virgo",       symbol: "♍", dates: "Aug 23 – Sep 22" },
  { name: "Libra",       symbol: "♎", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio",     symbol: "♏", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", symbol: "♐", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn",   symbol: "♑", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius",    symbol: "♒", dates: "Jan 20 – Feb 18" },
  { name: "Pisces",      symbol: "♓", dates: "Feb 19 – Mar 20" },
];

const readings = {
  Love:   "Positive energy surrounds your relationships. Open your heart.",
  Career: "New opportunities are knocking. Trust your instincts.",
  Health: "Focus on rest and mindful habits this week.",
  Finance:"A favourable period for investments and savings.",
};

export default function HoroscopePage() {
  const [selected, setSelected] = useState(null);

  return (
    <PageLayout title="Daily Horoscope" icon="⭐">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Signs grid */}
        <div className="lg:col-span-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {signs.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelected(s)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200 ${
                selected?.name === s.name
                  ? "bg-purple-600/30 border-purple-500/50 scale-[1.04]"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{s.symbol}</span>
              <p className="text-xs font-medium">{s.name}</p>
              <p className="text-[10px] text-gray-400">{s.dates}</p>
            </button>
          ))}
        </div>

        {/* Reading panel */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-center min-h-[300px]">
          {selected ? (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">{selected.symbol}</span>
                <div>
                  <h2 className="text-lg font-bold">{selected.name}</h2>
                  <p className="text-xs text-gray-400">{selected.dates}</p>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(readings).map(([key, val]) => (
                  <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-xs text-purple-400 font-semibold mb-1">{key}</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-5xl mb-3">⭐</p>
              <p className="text-sm">Select your zodiac sign to read today's horoscope</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
