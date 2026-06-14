"use client";

import Image from "next/image";
import { useState } from "react";

const faqs = [
  {
    question: "Why Is Astrology So Accurate?",
    answer:
      "Astrology accuracy comes from thousands of years of careful observation linking planetary movements to human experiences. Experienced astrologers study birth charts that map cosmic influences at your exact birth moment, providing personalized insights rather than generic predictions for everyone.",
  },
  {
    question: "Why Should You Choose Apsara Talk For An Astrology Horoscope?",
    answer:
      "Apsara Talk helps you connect with astrologers for focused guidance on love, career, health, family, and timing decisions.",
  },
  {
    question: "Is Astrology Prediction True?",
    answer:
      "Astrology is a guidance system based on chart interpretation. It can highlight patterns, timing, and tendencies, while your choices still shape your path.",
  },
  {
    question: "How Can Online Astrology Help Me In Predicting The Future?",
    answer:
      "Online astrology gives you fast access to horoscope, kundli, compatibility, and personalized consultation tools from wherever you are.",
  },
  {
    question: "How reliable is the Apsara Talk app?",
    answer:
      "The experience is designed around verified profiles, private sessions, and simple wallet/session flows so you can focus on the conversation.",
  },
  {
    question: "How much does Apsara Talk cost?",
    answer:
      "Costs can vary by service and astrologer. Check the selected consultation or wallet screen before starting a paid session.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="overflow-hidden rounded-[26px] border border-[#d8bd68]/60 bg-[#fffdf6] text-[#1f1608] shadow-[0_18px_44px_rgba(87,60,12,0.10)]">
      <div className="grid gap-0 lg:grid-cols-[0.72fr_1fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[#211704] lg:min-h-full">
          <Image
            src="/Astro_Banner.jpg"
            alt="Astrology guidance"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,13,2,0.16)_0%,rgba(20,13,2,0.76)_100%)]" />
          <div className="absolute inset-x-5 bottom-5 rounded-[22px] border border-white/30 bg-white/90 p-4 text-[#211704] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#916805]">
              Help Center
            </p>
            <h2 className="mt-1 text-xl font-extrabold leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#60481f]">
              Clear answers before you start a chat, call, or horoscope journey.
            </p>
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,#fffdf6_0%,#fbffe0_100%)] p-4 sm:p-6">
          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.question}
                  className={`rounded-[18px] border bg-white/86 shadow-[0_10px_26px_rgba(87,60,12,0.06)] transition ${
                    isOpen
                      ? "border-[#dfff00] shadow-[0_16px_34px_rgba(151,165,0,0.12)]"
                      : "border-[#e6e1d4] hover:border-[#d8bd68]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-extrabold text-[#4d4d4d] sm:px-5"
                    aria-expanded={isOpen}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-base font-bold transition ${
                        isOpen
                          ? "border-[#dfff00] bg-[#dfff00] text-[#211704] rotate-45"
                          : "border-[#e6e1d4] bg-white text-[#4d4d4d]"
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <p className="px-4 pb-5 text-sm leading-7 text-[#6b6b6b] sm:px-5">
                      {item.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
