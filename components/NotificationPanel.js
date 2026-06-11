"use client";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

export default function NotificationPanel() {
  const { notifOpen, setNotifOpen } = useApp();
  const { t } = useLanguage();
  if (!notifOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 cursor-pointer"
        onClick={() => setNotifOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full sm:w-80 h-full bg-[#0f1535] p-4 border-l border-white/10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">{t("notifications.title")}</h2>
          <button
            onClick={() => setNotifOpen(false)}
            className="text-sm text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          <div className="p-2 bg-white/5 rounded">{t("notifications.horoscopeReady")}</div>
          <div className="p-2 bg-white/5 rounded">{t("notifications.newMessage")}</div>
        </div>
      </div>
    </div>
  );
}
