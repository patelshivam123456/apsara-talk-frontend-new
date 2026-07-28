"use client";

import KundaliForm from "@/components/Kundali/KundaliForm";

export default function KundaliPdfPage({ theme = "public" }) {
  const isAstrologer = theme === "astrologer";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* <section
        className={`rounded-2xl border p-4 shadow-lg sm:p-5 lg:p-6 ${
          isAstrologer
            ? "border-[#d8a84a]/45 bg-[#fff8ee] text-[#211704]"
            : "border-[#eadcae] bg-[#fff9e9] text-[#211704]"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6106]">
          Free Services
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              Generate Kundali PDF
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d4d]">
              Enter birth details to generate Kundali PDF.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {["Name", "Date", "Time", "Place"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-[#d8a84a]/35 bg-white px-3 py-2 text-xs font-bold text-[#8a6106]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <KundaliForm theme={theme} />
    </div>
  );
}
