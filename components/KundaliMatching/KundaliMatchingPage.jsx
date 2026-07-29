"use client";

import KundaliMatchingForm from "@/components/KundaliMatching/KundaliMatchingForm";

export default function KundaliMatchingPage({ theme = "public" }) {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <KundaliMatchingForm theme={theme} />
    </div>
  );
}
