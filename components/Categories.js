"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";

const items = [
  "Love & Relationships",
  "Career & Finance",
  "Health & Wellness",
  "Personal Growth",
];

export default function Categories() {
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item}
            onClick={handleAction}
            className="bg-[#121735] px-3 py-4 rounded-xl hover:bg-purple-800 cursor-pointer transition"
          >
            <p className="font-medium text-sm">{item}</p>
            <p className="text-sm text-gray-400 mt-1">Explore →</p>
          </div>
        ))}
      </div>
    </>
  );
}
