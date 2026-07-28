"use client";

export default function PersonalInfoCard({ label, value }) {
  return (
    <article className="rounded-xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#211704]">
        {value || "N/A"}
      </p>
    </article>
  );
}
