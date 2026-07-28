"use client";

export default function PredictionCard({ title, value }) {
  return (
    <article className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-[#60481f]">
        {value || "Not available"}
      </p>
    </article>
  );
}
