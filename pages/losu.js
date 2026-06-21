"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import PageLayout from "@/components/PageLayout";
import "react-toastify/dist/ReactToastify.css";

const rowOrder = [
  ["topRow", "Top Row"],
  ["middleRow", "Middle Row"],
  ["bottomRow", "Bottom Row"],
];

function formatList(values) {
  return values?.length ? values.join(", ") : "None";
}

function formatDobForApi(value) {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

export default function LosuPage() {
  const [dob, setDob] = useState("");
  const [losuResult, setLosuResult] = useState(null);
  const [personalYearResult, setPersonalYearResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const hasResults = Boolean(losuResult && personalYearResult);
  const countEntries = losuResult?.counts
    ? Object.entries(losuResult.counts)
    : [];
  const summaryCards = [
    {
      label: "Date of Birth",
      value: losuResult?.dob,
      detail: "Source date used for Lo Shu calculation",
    },
    {
      label: "Driver Number",
      value: losuResult?.driverNumber,
      detail: losuResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Destiny Number",
      value: losuResult?.destinyNumber,
      detail: losuResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dob.trim()) {
      const nextMessage = "Please enter date of birth.";
      setMessage(nextMessage);
      toast.error(nextMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      setLosuResult(null);
      setPersonalYearResult(null);
      const normalizedDob = formatDobForApi(dob.trim());

      const response = await fetch(
        "/api/astro-proxy/astrology-services/home-page/lo-su",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ dob: normalizedDob }),
        }
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Unable to generate Lo Shu grid.");
      }

      const nextResult = result?.data || result;

      if (!nextResult?.grid || !nextResult?.counts) {
        throw new Error(result?.message || "Invalid Lo Shu grid response.");
      }

      const personalYearResponse = await fetch(
        "/api/astro-proxy/astrology-services/home-page/personal-year",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ dob: normalizedDob }),
        }
      );
      const personalYearResult = await personalYearResponse.json();

      if (!personalYearResponse.ok) {
        throw new Error(
          personalYearResult?.message ||
            "Unable to generate personal year details."
        );
      }

      const nextPersonalYearResult =
        personalYearResult?.data || personalYearResult;

      if (
        !nextPersonalYearResult ||
        nextPersonalYearResult.personalMonth === undefined ||
        nextPersonalYearResult.personalDay === undefined ||
        nextPersonalYearResult.personalYear === undefined
      ) {
        throw new Error(
          personalYearResult?.message ||
            "Invalid personal year details response."
        );
      }

      setLosuResult(nextResult);
      setPersonalYearResult(nextPersonalYearResult);
      const nextMessage = "Lo Shu Data generated successfully.";
      setMessage(nextMessage);
      toast.success(result?.message || nextMessage);
    } catch (error) {
      const nextMessage =
        error?.message || "Unable to generate Lo Shu Data. Please try again.";
      setMessage(nextMessage);
      toast.error(nextMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Lo Shu Details" icon="🔢">
      <ToastContainer position="top-right" autoClose={2500} theme="dark" />
      <div className="mx-auto max-w-4xl">
        <section className="rounded-xl border border-white/10 bg-[#0f1535] p-3 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]"
          >
            <label
              htmlFor="losu-dob"
              className="text-xs uppercase tracking-[0.14em] text-gray-400"
            >
              Enter DOB
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                id="losu-dob"
                type="date"
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition focus:border-[#d8a84a]/70 sm:w-48"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
              >
                {isSubmitting ? "Generating..." : "Submit"}
              </button>
            </div>
            {message && <p className="mt-2 text-xs text-gray-300">{message}</p>}
          </form>

          {hasResults && (
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1fr]">
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {summaryCards.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-[#211704]">
                        {item.value}
                      </p>
                      <p className="mt-0.5 text-xs text-[#665d4d]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["Personal Year", personalYearResult.personalYear],
                    ["Personal Month", personalYearResult.personalMonth],
                    ["Personal Day", personalYearResult.personalDay],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-purple-300/30 bg-purple-500/15 p-2.5 text-center transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-[10px] uppercase tracking-[0.12em] text-purple-100">
                        {label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                      Missing Numbers
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatList(losuResult.missingNumbers)}
                    </p>
                  </div>
                  <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]">
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                      Repeated Numbers
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {formatList(losuResult.repeatedNumbers)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#d8a84a]/40 bg-[#fff8ee] p-3 transition-all duration-200 hover:scale-[1.01]">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-[#211704]">
                      Number Counts
                    </h3>
                    <span className="rounded-full border border-[#d8a84a]/40 bg-[#fdefd4] px-3 py-1 text-xs text-[#8a6106]">
                      1 to 9
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9 lg:grid-cols-3">
                    {countEntries.map(([number, count]) => (
                      <div
                        key={number}
                        className="astro-dark-surface rounded-md border border-white/10 bg-[#10162f] px-1.5 py-1 text-center transition-all duration-200 hover:scale-[1.01]"
                      >
                        <p className="text-xs text-gray-400">No. {number}</p>
                        <p className="text-sm font-semibold text-white md:text-base">
                          {count}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#090d22]/80 p-3 transition-all duration-200 hover:scale-[1.01]">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
                      Grid placement
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Right-side Lo Shu Box
                    </h3>
                  </div>
                  <span className="rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
                    Astrologer view
                  </span>
                </div>

                <div className="mx-auto grid aspect-square w-full max-w-[320px] grid-rows-3 overflow-hidden rounded-2xl border border-[#d8a84a]/60 shadow-[inset_0_0_48px_rgba(216,168,74,0.12)]">
                  {rowOrder.map(([rowKey]) => (
                    <div key={rowKey} className="grid grid-cols-3">
                      {losuResult.grid[rowKey].map((value, index) => (
                        <div
                          key={`${rowKey}-${index}`}
                          className="flex items-center justify-center border border-[#d8a84a]/45"
                        >
                          <span
                            className={`text-2xl font-bold ${
                              value ? "text-[#f0c040]" : "text-white/20"
                            }`}
                          >
                            {value || "-"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {rowOrder.map(([rowKey, rowLabel]) => (
                    <div
                      key={rowKey}
                      className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                        {rowLabel}
                      </p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-white">
                        {losuResult.grid[rowKey]
                          .map((value) => value || "Empty")
                          .join(" / ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
}
