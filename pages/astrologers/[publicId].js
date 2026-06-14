"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import PublicPageLayout from "@/components/PublicPageLayout";
import LoginPromptModal from "@/components/LoginPromptModal";
// import { astrologerData } from "@/constants/Astrologer-Home-Data";
import { config } from "@/constants/URLConfig";

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

export default function AstrologerDetailPage({astrologerData=[]}) {
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
      <PublicPageLayout
        eyebrow="Profile"
        title="Astrologer Not Found"
        description="This astrologer profile is not available right now."
      >
        <div className="flex flex-col items-center justify-center gap-4 rounded-[24px] border border-[#eadcae] bg-white/92 py-24 text-[#60481f] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
          <span className="text-5xl">🌌</span>
          <p className="text-base">No astrologer found with this profile ID.</p>
          <button
            onClick={() => router.push("/astrologers")}
            className="text-sm font-bold text-[#8a6106] transition hover:text-[#211704]"
          >
            ← Back to Astrologers
          </button>
        </div>
      </PublicPageLayout>
    );
  }

  /* ── Loading (query not hydrated yet) ── */
  if (!astro) {
    return (
      <PublicPageLayout
        eyebrow="Profile"
        title="Loading..."
        description="Loading astrologer profile details."
      >
        <div className="flex items-center justify-center rounded-[24px] border border-[#eadcae] bg-white/92 py-24 text-sm text-[#60481f] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
          Loading profile…
        </div>
      </PublicPageLayout>
    );
  }

  const languages = astro.language.split(",").map((l) => l.trim());

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      <PublicPageLayout
        eyebrow={astro.specialization || "Astrologer profile"}
        title={astro.displayName}
        description={astro.bio || "View astrologer details, experience, languages, and consultation options."}
      >

        <div className="max-w-2xl mx-auto flex flex-col gap-5">

          <div className="flex flex-col items-center gap-4 rounded-[24px] border border-[#eadcae] bg-white/92 p-6 text-center text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)]">

            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#d8ce76] bg-[#211704] text-3xl font-bold text-[#dfff00]">
              {getInitials(astro.firstName, astro.lastName)}
            </div>

            <div>
              <h2 className="text-xl font-extrabold">{astro.displayName}</h2>
              <p className="mt-0.5 text-sm font-medium text-[#6f5930]">
                {astro.firstName} {astro.middleName} {astro.lastName}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <span className="rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-3 py-1 text-xs font-bold text-[#8a6106]">
                {astro.specialization}
              </span>
              <span className="rounded-full border border-[#eee8d5] bg-[#fff8dc] px-3 py-1 text-xs font-bold text-[#60481f]">
                {astro.yearsOfExperience}+ Years Experience
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-full bg-[#f4ecd0] px-2 py-1 text-[11px] font-bold text-[#5d4a1b]"
                >
                  {lang}
                </span>
              ))}
            </div>

            <p className="max-w-md text-sm leading-relaxed text-[#60481f]">
              {astro.bio}
            </p>

            <div className="flex gap-3 w-full max-w-xs pt-2">
              <button
                onClick={handleAction}
                className="flex-1 rounded-full border border-[#e6ddc5] bg-[#fffdf6] py-2.5 text-sm font-bold text-[#4c493f] transition hover:border-[#d3bd7d] hover:bg-white"
              >
                Chat
              </button>
              <button
                onClick={handleAction}
                className="flex-1 rounded-full bg-[#dfff00] py-2.5 text-sm font-bold text-[#312d1e] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
              >
                Call
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#eadcae] bg-white/92 p-5 text-[#211704] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
            <p className="mb-4 text-[14px] font-extrabold uppercase tracking-widest text-[#8a6106]">
              Profile Details
            </p>

            <div className="grid grid-cols-2 gap-3">
              {INFO_ITEMS.map(({ label, key }) => (
                <div key={key} className="rounded-xl bg-[#fff8dc] px-4 py-3">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#8a7a55]">
                    {label}
                  </p>
                  <p className="text-sm font-semibold">
                    {astro[key] || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </PublicPageLayout>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const response = await fetch(
      config.getAstrologersList,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      }
    );

    const res = await response.json();
    return {
      props: {
        astrologerData: res?.data || [],
      },
    };
  } catch (error) {
    console.log(
      "Get Astrologers Error:",
      error
    );

    return {
      props: {
        astrologerData: [],
      },
    };
  }
}
