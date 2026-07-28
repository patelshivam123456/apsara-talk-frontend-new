"use client";

export default function LoadingSkeleton() {
  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-lg sm:p-5">
      <div className="h-5 w-52 rounded-full bg-[#efe6a5] motion-safe:animate-pulse" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-xl bg-[#fff8dc] motion-safe:animate-pulse"
          />
        ))}
      </div>
    </section>
  );
}
