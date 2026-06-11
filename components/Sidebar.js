"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import ThemeToggle from "@/components/ThemeToggle";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { balance }          = useSelector((state) => state.wallet);
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

      <aside className="w-full lg:w-[30%] border-t lg:border-t-0 lg:border-l border-white/10 bg-[#050816] p-4 flex flex-col gap-4">

        {/* WALLET */}
        {isLoggedIn && (
          <div className="order-first bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">{t("sidebar.wallet")}</p>
              <h2 className="text-xl font-semibold mt-1">₹ {balance.toFixed(2)}</h2>
            </div>
            <button
              onClick={() => router.push("/wallet")}
              className="bg-purple-600 px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
            >
              {t("hero.addMoney")}
            </button>
          </div>
        )}

        {/* DAILY HOROSCOPE */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between mb-4">
            <h3>{t("sidebar.dailyHoroscope")}</h3>
            <button
              onClick={handleAction}
              className="text-xs text-purple-400 hover:text-purple-300 transition"
            >
              {t("sidebar.viewAll")}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#25143d] flex items-center justify-center text-xl">
              ♈
            </div>
            <div>
              <h4 className="text-xl">{t("sidebar.aries")}</h4>
              <p className="text-xs text-gray-400">May 12, 2024</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-pink-400">{t("sidebar.love")}</span>
              <span className="text-gray-300">{t("sidebar.loveText")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-400">{t("sidebar.career")}</span>
              <span className="text-gray-300">{t("sidebar.careerText")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">{t("sidebar.health")}</span>
              <span className="text-gray-300">{t("sidebar.healthText")}</span>
            </div>
          </div>
        </div>

        {/* SUGGESTED */}
        <div className="bg-[#121735] p-4 rounded-xl border border-white/10">
          <h3 className="mb-2 font-semibold">{t("sidebar.suggestedQuestions")}</h3>
          <ul className="text-sm space-y-2 text-gray-300">
            {["sidebar.questionJob", "sidebar.questionMarriage", "sidebar.questionFocus"].map((q) => (
              <li
                key={q}
                onClick={handleAction}
                className="cursor-pointer hover:text-white transition"
              >
                {t(q)}
              </li>
            ))}
          </ul>
        </div>

        {/* SESSION */}
        <div className="bg-[#121735] p-4 rounded-xl border border-white/10">
          <h3 className="font-semibold">{t("sidebar.upcomingSession")}</h3>
          <p className="text-sm mt-2">Dr. Aryan Sharma</p>
          <button
            onClick={handleAction}
            className="bg-purple-600 hover:bg-purple-700 transition w-full mt-3 py-2 rounded-lg"
          >
            {t("sidebar.joinSession")}
          </button>
        </div>

        {/* THEME */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-3">{t("sidebar.theme")}</p>
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
