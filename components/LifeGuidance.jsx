"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

const items = [
  {
    titleKey: "categories.love",
    descKey: "life.loveDesc",
    icon: "❤️",
    gradient: "from-pink-500/20 to-purple-500/10",
  },
  {
    titleKey: "categories.career",
    descKey: "life.careerDesc",
    icon: "💼",
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    titleKey: "categories.health",
    descKey: "life.healthDesc",
    icon: "🧘",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    titleKey: "categories.growth",
    descKey: "life.growthDesc",
    icon: "🌱",
    gradient: "from-yellow-500/20 to-orange-500/10",
  },
];

export default function LifeGuidance() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);
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

      <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            {t("life.title")}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {t("life.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
            key={item.titleKey}
              onClick={handleAction}
              className={`relative p-4 rounded-xl border border-white/10 bg-linear-to-br ${item.gradient} hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
            >
              <div className="text-xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-medium">{t(item.titleKey)}</h3>
              <p className="text-xs text-gray-400 mt-1">{t(item.descKey)}</p>
              <p className="text-xs text-purple-400 mt-3 group-hover:underline">
                {t("categories.explore")} →
              </p>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-[0_0_30px_rgba(139,92,246,0.3)]" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
