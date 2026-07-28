"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KundaliPdfPage from "@/components/Kundali/KundaliPdfPage";
import PublicPageLayout from "@/components/PublicPageLayout";
import { config } from "@/constants/URLConfig";
import { serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";

export default function PublicKundaliPdfPage({ profileData }) {
  return (
    <PublicPageLayout
      eyebrow="Kundali PDF"
      title="Generate Kundali PDF"
      description="Search your birth place, select a chart style, and create a client-ready Kundali PDF from accurate birth details."
      profileData={profileData}
    >
      <KundaliPdfPage theme="public" />
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
