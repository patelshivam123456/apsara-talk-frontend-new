"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";

const items = [
  {
    title: "Love & Relationships",
    desc: "Understand your emotional path",
    icon: "❤️",
    gradient: "from-pink-500/20 to-purple-500/10",
  },
  {
    title: "Career & Finance",
    desc: "Plan your next big move",
    icon: "💼",
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    title: "Health & Wellness",
    desc: "Balance your mind & body",
    icon: "🧘",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    title: "Personal Growth",
    desc: "Unlock your true potential",
    icon: "🌱",
    gradient: "from-yellow-500/20 to-orange-500/10",
  },
];

export default function LifeGuidance() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);

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
            Guidance for Every Part of Your Life
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Explore insights tailored to your journey
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.title}
              onClick={handleAction}
              className={`relative p-4 rounded-xl border border-white/10 bg-linear-to-br ${item.gradient} hover:scale-[1.02] transition-all duration-200 cursor-pointer group`}
            >
              <div className="text-xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-medium">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              <p className="text-xs text-purple-400 mt-3 group-hover:underline">
                Explore →
              </p>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-[0_0_30px_rgba(139,92,246,0.3)]" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
