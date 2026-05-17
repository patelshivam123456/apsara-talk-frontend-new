"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";

const actions = [
  { title: "Talk to Astrologer", icon: "💬" },
  { title: "Daily Horoscope",    icon: "⭐" },
  { title: "Kundli Report",      icon: "✉️" },
  { title: "Compatibility",      icon: "❤️" },
];

export default function QuickActions() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

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

      <div className={`quick-actions bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md ${isLoggedIn ? "h-[280px] sm:h-[180px]" : "h-[280px] sm:h-full"}`}>

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
            Quick Actions
          </h2>
          <span
            onClick={handleAction}
            className="text-xs text-purple-400 cursor-pointer hover:text-purple-300 transition"
          >
            View All →
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-[120px] sm:h-[70px]">
          {actions.map((item) => (
            <div
              key={item.title}
              onClick={handleAction}
              className="group flex flex-col items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-purple-600/20 hover:border-purple-500/40 hover:scale-[1.04] hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-200 cursor-pointer"
            >
              {/* Icon Circle */}
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-purple-500/40 transition-all duration-200">
                <span className="text-lg">{item.icon}</span>
              </div>

              {/* Label */}
              <p className="text-xs text-center text-gray-300 group-hover:text-white transition font-medium leading-tight">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
