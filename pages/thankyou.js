"use client";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ThankYouPage() {
  const router = useRouter();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // If not logged in, bounce back to home
  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen dashboard-bg text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0f1535] border border-white/10 rounded-3xl p-10 text-center shadow-2xl">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-4xl">
          ✨
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-2">
          Thank You{user?.name ? `, ${user.name}` : ""}!
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed mb-2">
          Your request has been received.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Our astrologer will connect with you shortly. The stars are aligning just for you 🌟
        </p>

        {/* Stars decoration */}
        <div className="flex justify-center gap-2 text-yellow-400 text-xl mb-8">
          ⭐ ⭐ ⭐ ⭐ ⭐
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-semibold text-sm"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
