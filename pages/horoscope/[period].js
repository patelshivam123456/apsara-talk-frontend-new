"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import HoroscopeModulePage from "@/components/Horoscope/HoroscopeModulePage";
import { horoscopePeriods } from "@/components/Horoscope/horoscopeData";
import PageLayout from "@/components/PageLayout";
import PublicPageLayout from "@/components/PublicPageLayout";
import { config } from "@/constants/URLConfig";
import { serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";
import {
  ASTROLOGER_ROLE,
  ADMIN_ROLE,
  getUserRoles,
} from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";

export default function HoroscopePeriodPage({ period, profileData }) {
  const periodConfig = horoscopePeriods[period] || horoscopePeriods.daily;
  const { isAuthLoaded, user } = useSelector((state) => state.auth);
  const roles = [
    ...new Set([
      ...getUserRoles(profileData),
      ...getUserRoles(user),
      ...(isAuthLoaded ? getStoredRoles() : []),
    ]),
  ];
  const isAstrologer =
    roles.includes(ASTROLOGER_ROLE) && !roles.includes(ADMIN_ROLE);

  if (isAstrologer) {
    return (
      <PageLayout title={periodConfig.title} icon="⭐">
        <HoroscopeModulePage period={period} theme="astrologer" />
        <ToastContainer position="top-right" autoClose={3000} />
      </PageLayout>
    );
  }

  return (
    <PublicPageLayout
      eyebrow={periodConfig.eyebrow}
      title={periodConfig.title}
      description={periodConfig.description}
      profileData={profileData}
    >
      <HoroscopeModulePage period={period} theme="public" />
      <ToastContainer position="top-right" autoClose={3000} />
    </PublicPageLayout>
  );
}

export async function getServerSideProps(context) {
  const period = String(context.params?.period || "daily").toLowerCase();

  if (!horoscopePeriods[period]) {
    return {
      notFound: true,
    };
  }

  let profileData = null;

  try {
    const { response } = await serverFetchWithAuth(
      config.getClientProfile,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
      { req: context.req, res: context.res },
    );

    if (response.ok) {
      const profileRes = await response.json();
      profileData = profileRes?.success ? stripAuthFields(profileRes.data) : null;
    }
  } catch {
    profileData = null;
  }

  return {
    props: {
      period,
      profileData,
    },
  };
}
