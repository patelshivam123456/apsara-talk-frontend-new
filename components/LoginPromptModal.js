"use client";

import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPromptModal({ onClose }) {
  const router = useRouter();
  const { t } = useLanguage();

  const handleOk = () => {
    onClose();
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-[#0f1535] border border-white/10 rounded-3xl p-8 text-white shadow-2xl text-center">

        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-3xl">
          🔐
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2">{t("modal.loginRequired")}</h2>

        {/* Message */}
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          {t("modal.loginMessage")}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5 transition"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleOk}
            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold transition"
          >
            {t("auth.login")} →
          </button>
        </div>
      </div>
    </div>
  );
}
