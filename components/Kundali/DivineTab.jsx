"use client";

function LinkButton({ href, children, download }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      download={download}
      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#dfff00] px-5 text-sm font-extrabold text-[#312d1e] shadow-sm transition hover:bg-[#cdf000]"
    >
      {children}
    </a>
  );
}

export default function DivineTab({ divine }) {
  const data = divine?.data || {};

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        {[
          ["Name", data.name || "N/A"],
          // ["Status", divine?.status || data.status || "N/A"],
          // ["Message", divine?.message || data.message || "N/A"],
          ["Report URL", data.report_url || "N/A"],
          ["Download URL", data.download_url || "N/A"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-xl border border-[#eadcae] bg-white/92 p-4 shadow-sm"
          >
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
              {label}
            </p>
            <p className="mt-2 break-words text-sm font-semibold text-[#211704]">
              {value}
            </p>
          </article>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <LinkButton href={data.report_url}>Open Report</LinkButton>
        <LinkButton href={data.download_url} download>
          Download PDF
        </LinkButton>
      </div>
    </div>
  );
}
