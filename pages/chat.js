"use client";
import PageLayout from "@/components/PageLayout";
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
    <PageLayout title={isAstrologer ? "Our Clients" : "Chat / Sessions"} icon="💬">
      <div className="flex gap-2 mb-6">
        {[
          "sessions",
          isAstrologer ? "client notes" : "messages",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
              tab === t
                ? "bg-purple-600 text-white"
                : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "sessions" && (
        <div className="space-y-3">
          {visibleSessions.map((s) => (
            <div key={s.name} className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-purple-500/30 bg-white text-sm font-semibold text-[#0f1535]">
                  {getInitials(s.name) || "AT"}
                </div>
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.role}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.date}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                s.status === "upcoming"
                  ? "bg-green-500/15 text-green-400 border-green-500/30"
                  : "bg-white/5 text-gray-400 border-white/10"
              }`}>
                {s.status === "upcoming" || s.status === "waiting" ? "Open" : s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab !== "sessions" && (
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-sm">
            {isAstrologer
              ? "No client notes yet. Open a session to add consultation notes."
              : "No messages yet. Start a session with an astrologer."}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
