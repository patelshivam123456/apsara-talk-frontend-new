"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
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
    <PublicPageLayout
      eyebrow="Daily insight"
      title="Daily Horoscope"
      description="Select your zodiac sign for a warm, practical reading across love, career, health, and finance."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-3 gap-3 rounded-[24px] bg-white/92 p-4 shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:grid-cols-4 sm:p-5 lg:col-span-2">
          {signs.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelected(s)}
              className={`flex min-h-[112px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-[#211704] transition-all duration-200 ${
                selected?.name === s.name
                  ? "scale-[1.03] border-[#d8ce76] bg-[#fbf8cc] shadow-[0_14px_28px_rgba(126,98,10,0.16)]"
                  : "border-[#eee8d5] bg-[#fffdf8] hover:bg-[#fff8dc]"
              }`}
            >
              <span className="text-2xl">{s.symbol}</span>
              <p className="text-xs font-bold">{s.name}</p>
              <p className="text-center text-[10px] font-medium text-[#6f5930]">{s.dates}</p>
            </button>
          ))}
        </div>

        <div className="flex min-h-[320px] flex-col justify-center rounded-[24px] border border-[#eadcae] bg-[#fffdf8] p-5 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
          {selected ? (
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-4xl">{selected.symbol}</span>
                <div>
                  <h2 className="text-lg font-extrabold">{selected.name}</h2>
                  <p className="text-xs font-medium text-[#6f5930]">{selected.dates}</p>
                </div>
              </div>
              <div className="space-y-3">
                {Object.entries(readings).map(([key, val]) => (
                  <div key={key} className="rounded-xl border border-[#eee8d5] bg-[#fff8dc] p-3">
                    <p className="mb-1 text-xs font-extrabold text-[#8a6106]">{key}</p>
                    <p className="text-xs leading-relaxed text-[#60481f]">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-[#6f5930]">
              <p className="mb-3 text-5xl">★</p>
              <p className="text-sm font-semibold">Select your zodiac sign to read today&apos;s horoscope</p>
            </div>
          )}
        </div>
      </div>
    </PublicPageLayout>
  );
}
