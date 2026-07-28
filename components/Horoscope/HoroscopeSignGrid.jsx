"use client";

import HoroscopeCard from "@/components/Horoscope/HoroscopeCard";
import { zodiacSigns } from "@/components/Horoscope/horoscopeData";

export default function HoroscopeSignGrid({
  selectedSign,
  loadingSign,
  onSelectSign,
  theme = "public",
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#d8a84a]/25 bg-[radial-gradient(circle_at_12%_40%,rgba(223,255,0,0.22),transparent_32%),linear-gradient(90deg,#65730c_0%,#362111_47%,#070b08_100%)] px-3 py-4 shadow-[0_18px_44px_rgba(33,23,4,0.18)]">
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.7)_0_1px,transparent_2px),radial-gradient(circle_at_62%_10%,rgba(255,255,255,0.55)_0_1px,transparent_2px),radial-gradient(circle_at_74%_68%,rgba(255,255,255,0.45)_0_1px,transparent_2px),radial-gradient(circle_at_96%_44%,rgba(255,255,255,0.6)_0_1px,transparent_2px)]" />
      <div className="relative flex gap-3 overflow-x-auto pb-1 sm:justify-between xl:grid xl:grid-cols-12 xl:overflow-visible">
        {zodiacSigns.map((sign) => (
          <HoroscopeCard
            key={sign.sign}
            sign={sign}
            active={selectedSign === sign.sign}
            disabled={!!loadingSign}
            onSelect={onSelectSign}
            theme={theme}
          />
        ))}
      </div>
    </section>
  );
}
