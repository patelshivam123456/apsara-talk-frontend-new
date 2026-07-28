"use client";

import PersonalInfoCard from "@/components/AstroProfile/PersonalInfoCard";

export default function AstroInfoGrid({ title, items }) {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-extrabold text-[#211704]">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map(([label, value]) => (
          <PersonalInfoCard key={label} label={label} value={value} />
        ))}
      </div>
    </section>
  );
}
