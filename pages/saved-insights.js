"use client";
import PageLayout from "@/components/PageLayout";
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
    <PageLayout title="Saved Insights" icon="🔖">
      {saved.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          <p className="text-5xl mb-4">🔖</p>
          <p className="text-sm">No saved insights yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {insights.map((item, i) => saved.includes(i) && (
            <div key={i} className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-purple-500/30 transition">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300">{item.category}</span>
                </div>
                <button onClick={() => remove(i)} className="text-gray-500 hover:text-red-400 transition text-xs">✕</button>
              </div>
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <p className="text-[10px] text-gray-500">Saved {item.saved}</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
