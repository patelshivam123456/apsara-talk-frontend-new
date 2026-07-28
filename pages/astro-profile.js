"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AstroProfilePage from "@/components/AstroProfile/AstroProfilePage";
import PublicPageLayout from "@/components/PublicPageLayout";
import { config } from "@/constants/URLConfig";
import { serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";

export default function PublicAstroProfilePage({ profileData }) {
  return (
    <PublicPageLayout
      eyebrow="Basic Astro Details"
      title="Apsara Astro Profile"
      description="Enter birth details to generate your basic astrology profile."
      profileData={profileData}
    >
      <AstroProfilePage theme="public" />
      <ToastContainer position="top-right" autoClose={3000} />
    </PublicPageLayout>
  );
}

export async function getServerSideProps(context) {
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
      profileData,
    },
  };
}
