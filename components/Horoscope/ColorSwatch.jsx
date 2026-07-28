"use client";

export default function ColorSwatch({ color }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#eadcae] bg-white px-3 py-2">
      <span
        className="h-7 w-7 rounded-lg border border-black/10 shadow-inner"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-bold text-[#211704]">{color}</span>
    </div>
  );
}
