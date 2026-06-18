"use client";

import { useRef } from "react";
import Link from "next/link";

const OTP_LENGTH = 6;

export default function OtpVerificationModal({
  open,
  email,
  otp,
  error,
  signupType = "client",
  onChange,
  onVerify,
}) {
  const inputRefs = useRef([]);

  if (!open) {
    return null;
  }

  const digits = otp.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH).split("");

  const setDigits = (nextDigits, focusIndex) => {
    onChange(nextDigits.join("").replace(/\D/g, "").slice(0, OTP_LENGTH));

    if (typeof focusIndex === "number") {
      requestAnimationFrame(() => inputRefs.current[focusIndex]?.focus());
    }
  };

  const handleChange = (index, nextValue) => {
    const numericValue = nextValue.replace(/\D/g, "");

    if (!numericValue) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      setDigits(nextDigits);
      return;
    }

    const nextDigits = [...digits];
    numericValue
      .slice(0, OTP_LENGTH - index)
      .split("")
      .forEach((digit, offset) => {
        nextDigits[index + offset] = digit;
      });
    setDigits(nextDigits, Math.min(index + numericValue.length, OTP_LENGTH - 1));
  };

  const handleKeyDown = (index, event) => {
    if (event.key !== "Backspace" || digits[index]) {
      return;
    }

    event.preventDefault();
    const nextDigits = [...digits];
    const previousIndex = Math.max(index - 1, 0);
    nextDigits[previousIndex] = "";
    setDigits(nextDigits, previousIndex);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");
    const nextDigits = Array.from(
      { length: OTP_LENGTH },
      (_, index) => pastedDigits[index] || ""
    );
    setDigits(nextDigits, Math.min(pastedDigits.length, OTP_LENGTH - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/30 px-3 py-4">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white px-4 py-5 shadow-xl shadow-stone-900/20 sm:px-8 sm:py-7">
        <p className="text-sm font-semibold text-stone-800">
          ApsaraAstro Verification
        </p>
        <h2 className="mt-5 text-xl font-semibold text-stone-950">
          OTP Verification
        </h2>
        <p className="mt-1 text-xs text-stone-700">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-stone-950">{email}</span>
        </p>

        <div className="mt-3 grid max-w-full grid-cols-6 gap-1.5 sm:gap-0.5">
          {Array.from({ length: OTP_LENGTH }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              value={digits[index] || ""}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              aria-label={`OTP digit ${index + 1}`}
              className={`h-11 min-w-0 border bg-white text-center text-lg font-semibold text-stone-950 outline-none transition focus:border-[#d8ce76] focus:ring-2 focus:ring-[#dfff00]/30 sm:h-12 ${
                error ? "border-red-500" : "border-stone-400"
              }`}
              maxLength={1}
            />
          ))}
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link href={`/signup?type=${signupType}`} className="text-xs font-semibold text-[#5f5f00]">
            Didn&apos;t get OTP or try other username?
          </Link>
          <button
            type="button"
            onClick={onVerify}
            className="h-9 rounded-full bg-[#dfff00] px-5 text-xs font-black text-[#211704] shadow-[0_10px_24px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}

export { OTP_LENGTH };
