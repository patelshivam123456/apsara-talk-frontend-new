"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ErrorState from "@/components/Horoscope/ErrorState";
import HoroscopeSignGrid from "@/components/Horoscope/HoroscopeSignGrid";
import HoroscopeTabs from "@/components/Horoscope/HoroscopeTabs";
import LoadingSkeleton from "@/components/Horoscope/LoadingSkeleton";
import { horoscopePeriods } from "@/components/Horoscope/horoscopeData";
import { getHoroscopeByPeriod } from "@/services/horoscope.service";

export default function HoroscopeModulePage({ period = "daily", theme = "public" }) {
  const config = horoscopePeriods[period] || horoscopePeriods.daily;
  const cacheRef = useRef({});
  const abortRef = useRef(null);
  const [selectedSign, setSelectedSign] = useState("");
  const [loadingSign, setLoadingSign] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => () => abortRef.current?.abort(), []);

  const loadHoroscope = async (sign, force = false) => {
    const cacheKey = `${period}:${sign.sign}`;

    if (!force && cacheRef.current[cacheKey]) {
      setSelectedSign(sign.sign);
      setResult(cacheRef.current[cacheKey]);
      setError("");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setSelectedSign(sign.sign);
    setLoadingSign(sign.sign);
    setError("");

    try {
      const response = await getHoroscopeByPeriod(period, sign.sign, {
        signal: controller.signal,
      });
      cacheRef.current[cacheKey] = response;
      setResult(response);
      toast.success(`${config.label} horoscope loaded for ${sign.name}.`);
    } catch (err) {
      if (controller.signal.aborted) {
        return;
      }

      setResult(null);
      setError(err?.message || "Unable to load horoscope.");
      toast.error(err?.message || "Unable to load horoscope.");
    } finally {
      if (!controller.signal.aborted) {
        setLoadingSign("");
      }
    }
  };

  const selectedSignObject = selectedSign
    ? { sign: selectedSign, name: selectedSign }
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      {/* <section
        className={`rounded-2xl border p-4 shadow-lg sm:p-5 lg:p-6 ${
          theme === "astrologer"
            ? "border-[#d8a84a]/45 bg-[#fff8ee] text-[#211704]"
            : "border-[#eadcae] bg-[#fff9e9] text-[#211704]"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6106]">
          {config.eyebrow}
        </p>
        <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
              {config.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665d4d]">
              {config.description}
            </p>
          </div>
          <div className="rounded-full border border-[#d8a84a]/40 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[#8a6106]">
            {config.label}
          </div>
        </div>
      </section> */}

      <HoroscopeSignGrid
        selectedSign={selectedSign}
        loadingSign={loadingSign}
        onSelectSign={loadHoroscope}
        theme={theme}
      />

      {loadingSign && <LoadingSkeleton />}

      {error && selectedSignObject && (
        <ErrorState
          message={error}
          onRetry={() => loadHoroscope(selectedSignObject, true)}
        />
      )}

      {!loadingSign && !error && result && (
        <HoroscopeTabs result={result} sign={selectedSign} />
      )}

      {!loadingSign && !error && !result && (
        <section className="rounded-2xl border border-dashed border-[#d8a84a]/60 bg-white/80 p-6 text-center text-sm font-semibold text-[#6f5930]">
          Select a zodiac sign to view the horoscope.
        </section>
      )}
    </div>
  );
}
