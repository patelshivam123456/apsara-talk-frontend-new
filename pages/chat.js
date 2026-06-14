"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getUserRoles } from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";

const sessions = [
  { name: "Dr. Aryan Sharma", role: "Vedic Astrology", date: "Today, 4:00 PM", status: "upcoming" },
  { name: "Neha Iyer",        role: "Tarot Reading",   date: "Yesterday, 6:30 PM", status: "completed" },
  { name: "Astro Vihaan",     role: "Vedic Astrology", date: "May 10, 11:00 AM",   status: "completed" },
];

const clientSessions = [
  { name: "Aarav Mehta", role: "Career clarity", date: "Today, 4:00 PM", status: "waiting" },
  { name: "Nisha Rao", role: "Marriage compatibility", date: "Yesterday, 6:30 PM", status: "follow-up" },
  { name: "Kabir Sinha", role: "Birth chart reading", date: "May 10, 11:00 AM", status: "completed" },
];

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function ChatPage() {
  const [tab, setTab] = useState("sessions");
  const { user } = useSelector((state) => state.auth);
  const roles = [
    ...new Set([
      ...getUserRoles(user),
      ...getStoredRoles(),
    ]),
  ];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isAstrologer = roles.includes("ROLE_ASTROLOGER") && !isAdmin;
  const visibleSessions = isAstrologer ? clientSessions : sessions;

  return (
    <PublicPageLayout
      eyebrow={isAstrologer ? "Client workspace" : "Consultation chat"}
      title={isAstrologer ? "Our Clients" : "Chat / Sessions"}
      description={
        isAstrologer
          ? "Review client sessions, follow-ups, and consultation context from a clean inner page."
          : "Track your chats, upcoming consultation sessions, and message history."
      }
    >
      <div className="flex gap-2 mb-6">
        {[
          "sessions",
          isAstrologer ? "client notes" : "messages",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
              tab === t
                ? "bg-[#211704] text-white"
                : "border border-[#d8ce76] bg-[#fbf8cc] text-[#4d3f12] hover:bg-[#fff8a8]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "sessions" && (
        <div className="space-y-3">
          {visibleSessions.map((s) => (
            <div key={s.name} className="flex items-center justify-between gap-4 rounded-[22px] border border-[#eadcae] bg-white/92 p-4 text-[#211704] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#211704] text-sm font-bold text-[#dfff00]">
                  {getInitials(s.name) || "AT"}
                </div>
                <div>
                  <p className="text-sm font-extrabold">{s.name}</p>
                  <p className="text-xs font-medium text-[#6f5930]">{s.role}</p>
                  <p className="mt-0.5 text-xs text-[#8a7a55]">{s.date}</p>
                </div>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${
                s.status === "upcoming"
                  ? "border-[#9fd56d] bg-[#e8f8d7] text-[#236b24]"
                  : "border-[#eadcae] bg-[#fff8dc] text-[#6f5930]"
              }`}>
                {s.status === "upcoming" || s.status === "waiting" ? "Open" : s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab !== "sessions" && (
        <div className="rounded-[24px] border border-[#eadcae] bg-white/92 p-8 text-center text-[#60481f] shadow-[0_12px_28px_rgba(94,70,12,0.10)]">
          <p className="mb-3 text-4xl">💬</p>
          <p className="text-sm font-medium">
            {isAstrologer
              ? "No client notes yet. Open a session to add consultation notes."
              : "No messages yet. Start a session with an astrologer."}
          </p>
        </div>
      )}
    </PublicPageLayout>
  );
}
