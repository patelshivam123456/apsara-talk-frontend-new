"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import { useState } from "react";

const signs = ["Aries ♈","Taurus ♉","Gemini ♊","Cancer ♋","Leo ♌","Virgo ♍","Libra ♎","Scorpio ♏","Sagittarius ♐","Capricorn ♑","Aquarius ♒","Pisces ♓"];

const getScore = (a, b) => {
  if (!a || !b) return null;
  const seed = (a.charCodeAt(0) + b.charCodeAt(0)) % 41;
  return 60 + seed;
};

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState("");
  const [sign2, setSign2] = useState("");
  const score = getScore(sign1, sign2);

  const color = score >= 85 ? "text-[#237a24]" : score >= 70 ? "text-[#9a6f08]" : "text-[#b91c1c]";
  const label = score >= 85 ? "Excellent Match" : score >= 70 ? "Good Match" : "Challenging Pair";

  return (
    <PublicPageLayout
      eyebrow="Relationship match"
      title="Compatibility"
      description="Choose two zodiac signs to check a simple match score with love, trust, communication, and values cues."
    >
      <div className="mx-auto max-w-3xl">
        <div className="space-y-6 rounded-[24px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">

          <p className="text-center text-sm font-medium text-[#60481f]">Choose two zodiac signs to check cosmic compatibility</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Your Sign", value: sign1, set: setSign1 },
              { label: "Partner's Sign", value: sign2, set: setSign2 }].map(({ label, value, set }) => (
              <div key={label}>
                <p className="mb-1.5 text-xs font-extrabold uppercase tracking-widest text-[#8a6106]">{label}</p>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-[#eee8d5] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#211704] outline-none focus:border-[#d8ce76]"
                >
                  <option value="">Select sign</option>
                  {signs.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>

          {score !== null && (
            <div className="text-center space-y-4 pt-2">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="url(#compat-grad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                  />
                  <defs>
                    <linearGradient id="compat-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7"/>
                      <stop offset="100%" stopColor="#ec4899"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold ${color}`}>{score}%</span>
                </div>
              </div>
              <p className={`text-base font-extrabold ${color}`}>{label}</p>
              <div className="grid grid-cols-2 gap-3 text-left">
                {[["Love", "High emotional connection"], ["Trust", "Deeply loyal bond"], ["Communication", "Flows naturally"], ["Values", "Aligned life goals"]].map(([k,v]) => (
                  <div key={k} className="rounded-xl border border-[#eee8d5] bg-[#fff8dc] p-3">
                    <p className="text-xs font-extrabold text-[#8a6106]">{k}</p>
                    <p className="mt-1 text-xs text-[#60481f]">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicPageLayout>
  );
}
