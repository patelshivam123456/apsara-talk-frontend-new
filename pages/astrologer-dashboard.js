"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import PageLayout from "@/components/PageLayout";

const dashboardTabs = [
  {
    id: "kundali-pdf",
    label: "Kundali PDF",
    icon: "📄",
    route: "/astrologer/kundali-pdf",
  },
  {
    id: "horoscope",
    label: "Horoscope",
    icon: "⭐",
  },
  {
    id: "match-making-pdf",
    label: "Match Making PDF",
    icon: "🤝",
  },
  {
    id: "apsara-profile",
    label: "Apsara Astro Profile",
    icon: "🔭",
    route: "/astrologer/astro-profile",
  },
];

const horoscopePeriods = [
  ["Daily", "/horoscope/daily"],
  ["Weekly", "/horoscope/weekly"],
  ["Monthly", "/horoscope/monthly"],
  ["Yearly", "/horoscope/yearly"],
];

function getDisplayName(user) {
  const profile = user || {};

  return (
    profile.displayName ||
    profile.fullName ||
    [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username ||
    "Astrologer"
  );
}

function ActionButton({ children }) {
  return (
    <button
      type="button"
      className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
    >
      {children}
    </button>
  );
}

export default function AstrologerDashboardPage() {
  const [activeTab, setActiveTab] = useState("kundali-pdf");
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const displayName = useMemo(() => getDisplayName(user), [user]);

  return (
    <PageLayout title="Astrologer Dashboard" icon="🔭">
      <div className="mx-auto max-w-7xl space-y-4">
        <section className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-4 text-[#211704] shadow-lg shadow-black/10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a6106]">
            Apsara Astro Workspace
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#211704]">
                Welcome, {displayName}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#665d4d]">
                Manage client-ready reports, horoscope content, match making
                PDFs, and your Apsara Astro profile from one place.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Reports", "12"],
                ["Requests", "5"],
                ["Drafts", "3"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-md border border-[#d8a84a]/40 bg-white px-3 py-2"
                >
                  <p className="text-lg font-black text-[#211704]">{value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6106]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-[#0f1535] p-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {dashboardTabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.route) {
                      router.push(tab.route);
                      return;
                    }

                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-md border px-3 py-3 text-sm font-semibold transition ${
                    active
                      ? "border-[#d8a84a] bg-[#fff8ee] text-[#211704]"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-4 text-[#211704]">
            {activeTab === "kundali-pdf" && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <h3 className="text-xl font-bold">Kundali PDF</h3>
                  <p className="mt-1 text-sm leading-6 text-[#665d4d]">
                    Create, review, and download Kundali reports for assigned
                    clients.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["Birth Details", "Planetary Chart", "Dasha Summary", "PDF Notes"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-md border border-[#d8a84a]/30 bg-white p-3"
                        >
                          <p className="font-semibold">{item}</p>
                          <p className="mt-1 text-xs text-[#665d4d]">
                            Ready for astrologer review.
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="rounded-md border border-[#d8a84a]/30 bg-[#fffdf2] p-4">
                  <p className="text-sm font-bold">Next Kundali Request</p>
                  <p className="mt-2 text-2xl font-black">Client Report</p>
                  <p className="mt-1 text-xs text-[#665d4d]">
                    Generate the report after verifying birth date, time, and
                    place.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/astrologer/kundali-pdf"
                      className="inline-flex rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      Generate PDF
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "horoscope" && (
              <div>
                <h3 className="text-xl font-bold">Horoscope</h3>
                <p className="mt-1 text-sm leading-6 text-[#665d4d]">
                  Prepare horoscope readings by period.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {horoscopePeriods.map(([period, route]) => (
                    <div
                      key={period}
                      className="rounded-md border border-[#d8a84a]/30 bg-white p-4"
                    >
                      <p className="text-lg font-black">{period}</p>
                      <p className="mt-2 text-sm text-[#665d4d]">
                        Review predictions, remedies, lucky color, and guidance.
                      </p>
                      <div className="mt-4">
                        <Link
                          href={route}
                          className="inline-flex rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                        >
                          Open {period}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "match-making-pdf" && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <h3 className="text-xl font-bold">Match Making PDF</h3>
                  <p className="mt-1 text-sm leading-6 text-[#665d4d]">
                    Compare two profiles and prepare compatibility PDF reports.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {["Partner A Details", "Partner B Details", "Guna Match", "Compatibility Notes"].map(
                      (item) => (
                        <div
                          key={item}
                          className="rounded-md border border-[#d8a84a]/30 bg-white p-3"
                        >
                          <p className="font-semibold">{item}</p>
                          <p className="mt-1 text-xs text-[#665d4d]">
                            Add review comments before PDF export.
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="rounded-md border border-[#d8a84a]/30 bg-[#fffdf2] p-4">
                  <p className="text-sm font-bold">Compatibility Report</p>
                  <p className="mt-2 text-2xl font-black">Match Score</p>
                  <p className="mt-1 text-xs text-[#665d4d]">
                    Generate a client-facing PDF after completing both profiles.
                  </p>
                  <div className="mt-4">
                    <ActionButton>Generate Match PDF</ActionButton>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "apsara-profile" && (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
                <div>
                  <h3 className="text-xl font-bold">Apsara Astro Profile</h3>
                  <p className="mt-1 text-sm leading-6 text-[#665d4d]">
                    Keep your public astrologer profile, consultation modes,
                    expertise, and verification details updated.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ["Display Name", displayName],
                      ["Specialization", user?.specialization || "Vedic Astrology"],
                      ["Languages", user?.languagesKnown || user?.languages || "Hindi, English"],
                      ["Status", user?.status || "Active"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-md border border-[#d8a84a]/30 bg-white p-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]">
                          {label}
                        </p>
                        <p className="mt-1 font-bold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-[#d8a84a]/30 bg-[#fffdf2] p-4">
                  <p className="text-sm font-bold">Profile Actions</p>
                  <p className="mt-2 text-sm text-[#665d4d]">
                    Update your public profile and client-facing details.
                  </p>
                  <Link
                    href="/astrologer/astro-profile"
                    className="mt-4 inline-flex rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    Open Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
