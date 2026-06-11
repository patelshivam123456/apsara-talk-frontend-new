"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

const items = [
  "categories.love",
  "categories.career",
  "categories.health",
  "categories.growth",
];

export default function Categories() {
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item}
            onClick={handleAction}
            className="bg-[#121735] px-3 py-4 rounded-xl hover:bg-purple-800 cursor-pointer transition"
          >
            <p className="font-medium text-sm">{t(item)}</p>
            <p className="text-sm text-gray-400 mt-1">{t("categories.explore")} →</p>
          </div>
        ))}
      </div>
    </>
  );
}
