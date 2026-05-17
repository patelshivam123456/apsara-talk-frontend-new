"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import PageLayout from "@/components/PageLayout";
import LoginPromptModal from "@/components/LoginPromptModal";
import { astrologerData } from "@/constants/Astrologer-Home-Data";

const INFO_ITEMS = [
  { label: "City",         key: "city" },
  { label: "State",        key: "state" },
  { label: "Gender",       key: "gender" },
  { label: "Religion",     key: "religion" },
  { label: "Mother Tongue",key: "motherTongue" },
];

function getInitials(firstName, lastName) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
}

export default function AstrologerDetailPage() {
  const router = useRouter();
  const { publicId } = router.query;
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);

  const astro = astrologerData.find((a) => a.publicId === publicId);

  const handleAction = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      router.push("/thankyou");
    }
  };

  /* ── Not found ── */
  if (publicId && !astro) {
    return (
      <PageLayout title="Astrologer Not Found" icon="🔭">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
          <span className="text-5xl">🌌</span>
          <p className="text-base">No astrologer found with this profile ID.</p>
          <button
            onClick={() => router.push("/astrologers")}
            className="text-sm text-purple-400 hover:text-purple-300 transition"
          >
            ← Back to Astrologers
          </button>
        </div>
      </PageLayout>
    );
  }

  /* ── Loading (query not hydrated yet) ── */
  if (!astro) {
    return (
      <PageLayout title="Loading…" icon="🔭">
        <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
          Loading profile…
        </div>
      </PageLayout>
    );
  }

  const languages = astro.language.split(",").map((l) => l.trim());

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      <PageLayout title={astro.displayName} icon="🔭">

        <div className="max-w-2xl mx-auto flex flex-col gap-5">

          {/* ── PROFILE CARD ── */}
          <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col items-center gap-4 text-center">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-2 border-purple-400/30">
              {getInitials(astro.firstName, astro.lastName)}
            </div>

            {/* Name */}
            <div>
              <h2 className="text-xl font-bold">{astro.displayName}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {astro.firstName} {astro.middleName} {astro.lastName}
              </p>
            </div>

            {/* Specialization + Experience */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 text-xs rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 font-medium">
                {astro.specialization}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/10 text-gray-300">
                {astro.yearsOfExperience}+ Years Experience
              </span>
            </div>

            {/* Languages */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="text-[11px] px-2 py-0.5 bg-white/10 rounded-full text-gray-300"
                >
                  {lang}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {astro.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full max-w-xs pt-2">
              <button
                onClick={handleAction}
                className="flex-1 py-2.5 text-sm font-medium bg-white/5 rounded-xl hover:bg-white/10 border border-white/10 transition"
              >
                Chat
              </button>
              <button
                onClick={handleAction}
                className="flex-1 py-2.5 text-sm font-medium bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-[0_0_16px_rgba(139,92,246,0.3)]"
              >
                Call
              </button>
            </div>
          </div>

          {/* ── DETAILS CARD ── */}
          <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
            <p className="text-[14px] text-gray-400 font-semibold uppercase tracking-widest mb-4">
              Profile Details
            </p>

            <div className="grid grid-cols-2 gap-3">
              {INFO_ITEMS.map(({ label, key }) => (
                <div key={key} className="bg-white/5 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-sm font-medium">
                    {astro[key] || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PageLayout>
    </>
  );
}
