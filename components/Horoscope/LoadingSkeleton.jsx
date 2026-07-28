"use client";

export default function LoadingSkeleton() {
  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-lg sm:p-5">
      <div className="h-5 w-40 rounded-full bg-[#efe6a5] motion-safe:animate-pulse" />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl bg-[#fff8dc] motion-safe:animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
