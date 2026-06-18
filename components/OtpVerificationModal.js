"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpVerificationModal({
  open,
  email,
  otp,
  error,
  signupType = "client",
  onChange,
  onVerify,
  onResend,
  resendLoading = false,
}) {
  const inputRefs = useRef([]);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!open || secondsLeft <= 0) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timerId);
  }, [open, secondsLeft]);

  if (!open) {
    return null;
  }

  const digits = otp.padEnd(OTP_LENGTH, "").slice(0, OTP_LENGTH).split("");
  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(
    2,
    "0"
  )}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const handleResend = async () => {
    if (!onResend || resendLoading) {
      return;
    }

    const resent = await onResend();

    if (resent !== false) {
      setSecondsLeft(RESEND_SECONDS);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 px-3 py-4 backdrop-blur-sm">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white px-4 py-5 shadow-xl shadow-stone-900/20 sm:px-8 sm:py-7">
        <p className="text-sm font-semibold text-stone-800">
          <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
            Apsara
          </span>
          <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
            Astro
          </span>{" "}
          Verification
        </p>
        <h2 className="mt-5 text-xl font-semibold text-stone-950">
          OTP Verification
        </h2>
        <p className="mt-1 text-xs text-stone-700">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-[#dfff00]">{email}</span>
        </p>

        <div className="mt-3 grid max-w-full grid-cols-6 gap-1.5 sm:gap-1">
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
              className={`h-11 min-w-0 border bg-white text-center text-lg font-semibold text-stone-950 outline-none transition focus:border-[#d8ce76] focus:ring-2 focus:ring-[#dfff00]/30 sm:h-10 sm:w-12 rounded-md ${
                error ? "border-red-500" : "border-stone-400"
              }`}
              maxLength={1}
            />
          ))}
        </div>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
          <Link href={`/signup?type=${signupType}`} className="text-xs font-semibold text-[#5f5f00]">
            Didn&apos;t get OTP or try other username?
          </Link>
          <div className="text-xs text-stone-600">
          {secondsLeft > 0 ? (
            <span>
              Resend OTP available in{" "}
              <span className="font-bold text-[#211704]">{timerText}</span>
            </span>
          ) : (
            <div
              onClick={handleResend}
              disabled={resendLoading}
              className="cursor-pointer font-bold text-[#5f5f00] transition hover:text-[#211704] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </div>
          )}
        </div>
          </div>
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
