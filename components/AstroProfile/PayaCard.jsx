"use client";

export default function PayaCard({ paya }) {
  if (!paya) {
    return null;
  }

  const type = paya.type || paya.name || paya.paya || "N/A";
  const result = paya.result || paya.effect || paya.description || "N/A";

  return (
    <section className="rounded-2xl border border-[#c9a227]/45 bg-[#fff1b8] p-5 text-[#211704] shadow-[0_16px_34px_rgba(126,98,10,0.16)]">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#8a6106]">
        Paya
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-white/75 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
            Type
          </p>
          <p className="mt-1 text-xl font-black">{type}</p>
        </div>
        <div className="rounded-xl bg-white/75 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
            Result
          </p>
          <p className="mt-1 text-xl font-black">{result}</p>
        </div>
      </div>
    </section>
  );
}
