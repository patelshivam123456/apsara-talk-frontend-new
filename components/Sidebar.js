"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);
  const { t } = useLanguage();

  const handleAction = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      router.push("/thankyou");
    }
  };

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      <section className="rounded-[18px] bg-white/90 p-3 shadow-xl sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {isLoggedIn ? (
            <div className="rounded-[14px] bg-[#fffaf0]/85 p-3 text-[#1f1608] shadow-md sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-[#6f5930]">{t("sidebar.wallet")}</p>
                  <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">
                    ₹ {Number(balance || 0).toFixed(2)}
                  </h2>
                </div>
                <button
                  onClick={() => router.push("/wallet")}
                  className="inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000] sm:w-auto"
                >
                  {t("hero.addMoney")}
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[14px] bg-[#211704] p-3 text-white shadow-md sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#dfff00]">
                    {t("sidebar.firstChatFree")}
                  </p>
                  <div className="mt-2 text-lg font-extrabold text-[#f4e7bd]">
                    Talk to an astrologer now
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[#f4e7bd]">
                    {t("sidebar.firstChatText")}
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfff00] text-lg text-[#211704]">
                  ★
                </div>
              </div>
              <button
                onClick={handleAction}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000]"
              >
                Get Free Chat
              </button>
            </div>
          )}

        <div className="rounded-[14px] bg-[#fffaf0]/85 p-3 text-[#1f1608] shadow-md sm:p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-extrabold">{t("sidebar.dailyHoroscope")}</h3>
            <button
              onClick={handleAction}
              className="text-xs font-semibold text-[#8b55f6] transition hover:text-[#5b21b6]"
            >
              {t("sidebar.viewAll")}
            </button>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fff0a6] text-xl">
              ♈
            </div>
            <div>
              <h4 className="text-xl font-extrabold">{t("sidebar.aries")}</h4>
              <p className="text-xs text-[#6f5930]">May 12, 2024</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="font-medium text-[#b45309]">{t("sidebar.love")}</span>
              <span className="text-right text-[#1f1608]">{t("sidebar.loveText")}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-[#b45309]">{t("sidebar.career")}</span>
              <span className="text-right text-[#1f1608]">{t("sidebar.careerText")}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="font-medium text-[#276027]">{t("sidebar.health")}</span>
              <span className="text-right text-[#1f1608]">{t("sidebar.healthText")}</span>
            </div>
          </div>
        </div>

        {/* <div className="rounded-[14px] border border-[#d8bd68]/70 bg-[#fff5c8]/80 p-4 text-[#1f1608]">
          <h3 className="mb-3 font-extrabold">{t("sidebar.suggestedQuestions")}</h3>
          <ul className="space-y-2 text-sm">
            {["sidebar.questionJob", "sidebar.questionMarriage", "sidebar.questionFocus"].map((q) => (
              <li
                key={q}
                onClick={handleAction}
                className="cursor-pointer rounded-[10px] bg-[#efe6a5] px-3 py-2 font-medium transition hover:bg-[#e4d777]"
              >
                {t(q)}
              </li>
            ))}
          </ul>
        </div> */}

        <div className="rounded-[14px] bg-[#fff5c8]/80 p-3 text-[#1f1608] shadow-md sm:p-4">
          <h3 className="font-extrabold">{t("sidebar.upcomingSession")}</h3>
          <p className="mt-3 text-sm font-medium">Dr. Aryan Sharma</p>
          <button
            onClick={handleAction}
            className="inline-flex w-[100%]  shrink-0 mt-4 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000]"
          >
            {t("sidebar.joinSession")}
          </button>
        </div>
        </div>
      </section>
    </>
  );
}
