"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import PageLayout from "@/components/PageLayout";
import api from "@/utils/api";
import { getStoredAccessTokenClaims, hasStoredRole } from "@/utils/tokenStore";

const ASTROLOGER_ROLE = "ROLE_ASTROLOGER";

const fallbackClients = [
  {
    publicId: "pending-1",
    firstName: "Aarav",
    lastName: "Mehta",
    topic: "Career clarity",
    city: "Delhi",
    lastSession: "Today",
    status: "Waiting",
  },
  {
    publicId: "pending-2",
    firstName: "Nisha",
    lastName: "Rao",
    topic: "Marriage compatibility",
    city: "Mumbai",
    lastSession: "Yesterday",
    status: "Follow up",
  },
  {
    publicId: "pending-3",
    firstName: "Kabir",
    lastName: "Sinha",
    topic: "Birth chart reading",
    city: "Bengaluru",
    lastSession: "Jun 6",
    status: "Scheduled",
  },
];

function normalizeRoles(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((role) => String(role).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

function isAstrologerUser(user) {
  return [
    ...normalizeRoles(user?.roles),
    ...normalizeRoles(user?.authorities),
  ].includes(ASTROLOGER_ROLE);
}

function getInitials(firstName, lastName, displayName) {
  const nameParts = String(displayName || "")
    .split(" ")
    .filter(Boolean);

  return `${firstName?.charAt(0) || nameParts[0]?.charAt(0) || ""}${
    lastName?.charAt(0) || nameParts[1]?.charAt(0) || ""
  }`.toUpperCase();
}

function getDisplayName(profile = {}) {
  return (
    profile.displayName ||
    [profile.firstName, profile.middleName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Astrologer"
  );
}

function findAstrologerFromList(astrologers, profile, claims) {
  const candidates = [
    profile?.publicId,
    profile?.userId,
    profile?.username,
    profile?.email,
    profile?.phone,
    claims?.uid,
    claims?.sub,
  ]
    .filter(Boolean)
    .map(String);

  return astrologers.find((astro) =>
    [
      astro?.publicId,
      astro?.userId,
      astro?.username,
      astro?.email,
      astro?.phone,
    ].some((value) => value && candidates.includes(String(value)))
  );
}

function getClientName(client = {}) {
  return (
    [client.firstName, client.lastName].filter(Boolean).join(" ") ||
    client.displayName ||
    client.name ||
    "Client"
  );
}

function getProfileClients(profile = {}) {
  const clientSources = [
    profile.clients,
    profile.clientList,
    profile.assignedClients,
    profile.consultationClients,
    profile.bookings,
    profile.sessions,
  ];

  return clientSources.find(Array.isArray) || [];
}

export default function AstrologerProfilePage() {
  const router = useRouter();
  const { isLoggedIn, isAuthLoaded, user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(user || {});
  const [clients, setClients] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const userIsAstrologer =
    isAstrologerUser(user) || hasStoredRole(ASTROLOGER_ROLE);

  useEffect(() => {
    if (!isAuthLoaded) {
      return;
    }

    if (!isLoggedIn) {
      router.replace("/astrologer-login");
      return;
    }

    if (!userIsAstrologer) {
      router.replace("/profile");
    }
  }, [isAuthLoaded, isLoggedIn, router, userIsAstrologer]);

  useEffect(() => {
    if (!isAuthLoaded || !isLoggedIn || !userIsAstrologer) {
      return;
    }

    let cancelled = false;

    async function loadAstrologerWorkspace() {
      setIsLoading(true);

      try {
        let nextProfile = user || {};
        let nextClients = [];

        try {
          const profileRes = await api.get(
            "/authorization/astrologer/profile-me"
          );

          if (profileRes?.success && profileRes?.data) {
            nextProfile = profileRes.data;
          }
        } catch {
          const listRes = await api.get(
            "/authorization/info/get-all-astrologers"
          );
          const astrologers = Array.isArray(listRes?.data) ? listRes.data : [];
          const claims = getStoredAccessTokenClaims();
          const match = findAstrologerFromList(astrologers, user, claims);

          if (match) {
            nextProfile = match;
          }
        }

        try {
          const clientsRes = await api.get(
            "/authorization/astrologer/clients"
          );

          nextClients = Array.isArray(clientsRes?.data) ? clientsRes.data : [];
        } catch {
          nextClients = getProfileClients(nextProfile);
        }

        if (!cancelled) {
          setProfile(nextProfile || {});
          setClients(nextClients);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAstrologerWorkspace();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoaded, isLoggedIn, user, userIsAstrologer]);

  const displayName = getDisplayName(profile);
  const fullName =
    [profile?.firstName, profile?.middleName, profile?.lastName]
      .filter(Boolean)
      .join(" ") || displayName;
  const languages = String(profile?.language || "Hindi, English")
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);
  const visibleClients = clients.length ? clients : fallbackClients;

  const stats = useMemo(
    () => [
      {
        label: "Experience",
        value: `${profile?.yearsOfExperience || "5"}+ yrs`,
      },
      {
        label: "Clients",
        value: profile?.totalClients || clients.length || "New",
      },
      {
        label: "Rating",
        value: profile?.rating || "4.8",
      },
      {
        label: "Queue",
        value: clients.length || fallbackClients.length,
      },
    ],
    [clients.length, profile]
  );

  if (!isAuthLoaded || !isLoggedIn || !userIsAstrologer) {
    return null;
  }

  return (
    <PageLayout title="Astrologer Profile" icon="🔭">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="astro-dark-surface overflow-hidden rounded-2xl border border-white/10 bg-[#0f1535] shadow-[0_24px_80px_rgba(0,0,0,0.3)]">
          <div className="relative min-h-[300px]">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{ backgroundImage: "url('/Astro_Banner.jpg')" }}
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#050816] via-[#0f1535]/90 to-[#24123d]/75" />

            <div className="relative grid min-h-[300px] grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col justify-end">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                    {isOnline ? "Online now" : "Offline"}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    Verified ApsaraAstro Expert
                  </span>
                </div>

                <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-pink-300/40 bg-linear-to-br from-pink-500 to-violet-600 text-3xl font-bold text-white shadow-2xl">
                    {getInitials(
                      profile?.firstName,
                      profile?.lastName,
                      displayName
                    ) || "AT"}
                  </div>

                  <div>
                    <h2 className="break-words text-3xl font-semibold text-white md:text-4xl">
                      {displayName}
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">{fullName}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-300">
                      {profile?.bio ||
                        "Manage consultations, review client details, and keep your live astrology profile ready for seekers."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="astro-dark-surface rounded-2xl border border-white/10 bg-[#090d22]/80 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Availability
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                      Live consultation desk
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsOnline((value) => !value)}
                    className={`relative h-7 w-12 rounded-full border transition ${
                      isOnline
                        ? "border-emerald-300 bg-emerald-500"
                        : "border-white/20 bg-white/10"
                    }`}
                    aria-pressed={isOnline}
                  >
                    <span
                      className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                        isOnline ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="astro-dark-surface rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0f1535]/90 p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Profile Details
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Public information clients see before booking.
                </p>
              </div>
              <button
                onClick={() =>
                  profile?.publicId &&
                  router.push(`/astrologers/${profile.publicId}`)
                }
                disabled={!profile?.publicId}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                View Public
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Specialization", profile?.specialization || "Vedic Astrology"],
                ["City", profile?.city || "Not added"],
                ["State", profile?.state || "Not added"],
                ["Mother Tongue", profile?.motherTongue || "Not added"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                    {label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="astro-dark-surface mt-4 rounded-xl border border-white/10 bg-[#17112f] px-4 py-3">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                Languages
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1535]/90 p-5">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Clients And Sessions
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Assigned clients and active consultation requests.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                {isLoading ? "Syncing" : `${visibleClients.length} visible`}
              </span>
            </div>

            <div className="space-y-3">
              {visibleClients.map((client) => (
                <div
                  key={client.publicId || client.id || getClientName(client)}
                  className="astro-dark-surface grid grid-cols-1 gap-4 rounded-xl border border-white/10 bg-[#10162f] p-4 md:grid-cols-[1fr_auto]"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-[#0f1535]">
                      {getInitials(
                        client.firstName,
                        client.lastName,
                        getClientName(client)
                      ) || "C"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-semibold text-white">
                        {getClientName(client)}
                      </h4>
                      <p className="mt-1 text-sm text-gray-400">
                        {client.topic ||
                          client.question ||
                          client.serviceName ||
                          "General consultation"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {[client.city, client.lastSession || client.sessionDate]
                          .filter(Boolean)
                          .join(" • ") || "Details pending"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:justify-end">
                    <span className="rounded-full border border-pink-300/20 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-100">
                      {client.status || client.bookingStatus || "Active"}
                    </span>
                    <button
                      onClick={() => router.push("/chat")}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
