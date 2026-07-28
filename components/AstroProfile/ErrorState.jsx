"use client";

export default function ErrorState({ message, onRetry }) {
  return (
    <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-[#7f1d1d] shadow-sm">
      <p className="text-sm font-extrabold">Unable to generate Astro Profile</p>
      <p className="mt-2 text-sm leading-6">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
      >
        Retry
      </button>
    </section>
  );
}
