"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import { useState } from "react";

const insights = [
  { icon: "⭐", title: "Aries Horoscope — May 13",  desc: "Love: Open your heart. Career: New opportunities coming.", category: "Horoscope", saved: "Today" },
  { icon: "🪐", title: "Venus in Taurus Reading",   desc: "Expect harmony in relationships and financial gains.", category: "Planetary", saved: "Yesterday" },
  { icon: "💬", title: "Session with Neha Iyer",    desc: "Tarot cards indicate a new chapter begins in June.", category: "Session", saved: "May 11" },
  { icon: "🤖", title: "AI Cosmic Reading",          desc: "Trust your instincts — the universe supports your path.", category: "AI", saved: "May 10" },
];

export default function SavedInsightsPage() {
  const [saved, setSaved] = useState(insights.map((_, i) => i));

  const remove = (i) => setSaved((prev) => prev.filter((x) => x !== i));

  return (
    <PublicPageLayout
      eyebrow="Blog and insights"
      title="Saved Insights"
      description="Keep horoscope notes, planetary readings, session summaries, and AI guidance in one clean place."
    >
      {saved.length === 0 ? (
        <div className="rounded-[24px] border border-[#eadcae] bg-white/92 py-20 text-center text-[#60481f] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
          <p className="mb-4 text-5xl">🔖</p>
          <p className="text-sm font-medium">No saved insights yet.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
          {insights.map((item, i) => saved.includes(i) && (
            <div key={i} className="flex flex-col gap-3 rounded-[22px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_12px_28px_rgba(94,70,12,0.10)] transition hover:-translate-y-0.5 hover:border-[#d8ce76]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-2 py-1 text-[10px] font-bold text-[#8a6106]">{item.category}</span>
                </div>
                <button onClick={() => remove(i)} className="text-xs font-bold text-[#8a7a55] transition hover:text-red-600">×</button>
              </div>
              <div>
                <h3 className="text-sm font-extrabold">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#60481f]">{item.desc}</p>
              </div>
              <p className="text-[10px] font-medium text-[#8a7a55]">Saved {item.saved}</p>
            </div>
          ))}
        </div>
      )}
    </PublicPageLayout>
  );
}
