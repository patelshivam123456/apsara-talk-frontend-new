"use client";
import PageLayout from "@/components/PageLayout";
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

  const color = score >= 85 ? "text-green-400" : score >= 70 ? "text-yellow-400" : "text-red-400";
  const label = score >= 85 ? "Excellent Match 💫" : score >= 70 ? "Good Match ✨" : "Challenging Pair 🌱";

  return (
    <PageLayout title="Compatibility" icon="❤️">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 space-y-6">

          <p className="text-sm text-gray-400 text-center">Choose two zodiac signs to check cosmic compatibility</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Your Sign", value: sign1, set: setSign1 },
              { label: "Partner's Sign", value: sign2, set: setSign2 }].map(({ label, value, set }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1.5">{label}</p>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full bg-[#121735] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 text-white appearance-none cursor-pointer"
                >
                  <option value="">Select sign</option>
                  {signs.map((s) => <option key={s} value={s} className="bg-[#0f1535]">{s}</option>)}
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
              <p className={`text-base font-semibold ${color}`}>{label}</p>
              <div className="grid grid-cols-2 gap-3 text-left">
                {[["Love", "High emotional connection"], ["Trust", "Deeply loyal bond"], ["Communication", "Flows naturally"], ["Values", "Aligned life goals"]].map(([k,v]) => (
                  <div key={k} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-xs text-purple-400 font-semibold">{k}</p>
                    <p className="text-xs text-gray-400 mt-1">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
