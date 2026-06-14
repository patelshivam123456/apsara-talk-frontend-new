"use client";
import PublicPageLayout from "@/components/PublicPageLayout";
import Astrologers from "@/components/Astrologers";
import { config } from "@/constants/URLConfig";

export default function AstrologersPage({ astrologerData=[] }) {
  return (
    <PublicPageLayout
      eyebrow="Verified experts"
      title="Explore Astrologers"
      description="Browse astrologers by language, specialty, city, and experience, then choose chat or call when you are ready."
    >
      <Astrologers astrologerData={astrologerData} />
    </PublicPageLayout>
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
