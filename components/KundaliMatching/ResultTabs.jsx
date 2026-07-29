"use client";

import { useState } from "react";
import SafeDataRenderer from "@/components/KundaliMatching/SafeDataRenderer";

const tabs = ["Astrology", "Divine"];

function getResultData(result) {
  return result?.data || {};
}

function getDivineUrl(divine, key) {
  return divine?.[key] || divine?.data?.[key] || "";
}

function ReportButton({ href, children, download }) {
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

export default function ResultTabs({ result, person1Name, person2Name, theme = "public" }) {
  const [activeTab, setActiveTab] = useState("Astrology");
  const isAstrologer = theme === "astrologer";
  const resultData = getResultData(result);
  const astrology = resultData.astrology;
  const divine = resultData.divine;
  const reportUrl = getDivineUrl(divine, "report_url");
  const downloadUrl = getDivineUrl(divine, "download_url");

  return (
    <section
      className={`rounded-2xl border p-4 shadow-lg sm:p-5 ${
        isAstrologer
          ? "border-[#d8a84a]/45 bg-[#fff8ee] text-[#211704]"
          : "border-[#eadcae] bg-white/94 text-[#211704]"
      }`}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
            Kundali Matching Report
          </p>
          <h2 className="mt-1 text-xl font-extrabold">
            {person1Name || "Person 1"} and {person2Name || "Person 2"}
          </h2>
          <p className="mt-1 text-sm text-[#665d4d]">
            Switch tabs to view astrology and divine report data.
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-xl border border-[#eadcae] bg-[#fffdf6] p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-10 rounded-lg px-4 text-sm font-bold transition ${
                activeTab === tab
                  ? "bg-[#c9a227] text-[#211704] shadow-sm"
                  : "text-[#6f5930] hover:bg-[#fbf8cc]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {activeTab === "Astrology" ? (
          astrology === "NA" ? (
            <SafeDataRenderer data={null} emptyText="No Astrology Data Available" />
          ) : (
            <SafeDataRenderer
              data={astrology}
              emptyText="No Astrology Data Available"
            />
          )
        ) : (
          <div className="space-y-4">
            <SafeDataRenderer data={divine} />
            {(reportUrl || downloadUrl) && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <ReportButton href={reportUrl}>View Matching Report</ReportButton>
                <ReportButton href={downloadUrl} download>
                  Download Matching PDF
                </ReportButton>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
