"use client";
import PageLayout from "@/components/PageLayout";
import Astrologers from "@/components/Astrologers";
import { config } from "@/constants/URLConfig";

export default function AstrologersPage({ astrologerData=[] }) {
  return (
    <PageLayout title="Explore Astrologers" icon="🔭">
      <Astrologers astrologerData={astrologerData} />
    </PageLayout>
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
