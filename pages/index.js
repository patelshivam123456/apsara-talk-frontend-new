"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import Astrologers from "@/components/Astrologers";
import Categories from "@/components/Categories";
import PlanetaryHighlights from "@/components/PlanetaryHighlights";
import LifeGuidance from "@/components/LifeGuidance";
import ChatPanel from "@/components/ChatPanel";
import NotificationPanel from "@/components/NotificationPanel";
import DashboardPage from "@/components/DashboardPage";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";

import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import { config } from "@/constants/URLConfig";
import { updateProfileName } from "@/redux/slices/authSlice";
import { serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";

export default function Home({
  serverIsLoggedIn,
  profileData,
  astrologerData=[]
}) {
  const dispatch = useDispatch();

  // Redux state takes over after hydration; server prop covers the first render
  const { isLoggedIn: reduxIsLoggedIn } = useSelector(
    (state) => state.auth
  );

  const isLoggedIn =
    reduxIsLoggedIn || serverIsLoggedIn;

  useEffect(() => {
  if (profileData) {
    dispatch(
      updateProfileName({
        firstName:
          profileData?.firstName,

        lastName:
          profileData?.lastName,
      })
    );
  }
}, [profileData, dispatch]);

  // ✅ Logged-in dashboard
  if (isLoggedIn) {
    return (
      <DashboardPage
        profileData={profileData}
        astrologerData={astrologerData}
      />
    );
  }

  return (
    <div className="min-h-screen dashboard-bg text-[#1f1608]">
      <ChatPanel />
      <NotificationPanel />

      <div className="mx-auto w-full max-w-[1500px] p-3 sm:p-4 md:p-6">
        <main className="min-w-0 flex-1 space-y-4">
          <Header/>
          <Hero />
          <div className="flex w-full flex-col gap-4 lg:flex-row">
          <div className="dashboard-feature-panel w-full space-y-4 rounded-xl bg-white p-3 shadow-xl sm:p-5 lg:w-[70%]">
          <PlanetaryHighlights isLoggedIn={isLoggedIn} />
          <QuickActions />
          </div>
          {/* <div className="mx-4 border border-black/10"></div> */}
          <div className="w-full lg:w-[30%]">
          <Sidebar />
          </div>
          </div>
          <Astrologers limit={3} astrologerData={astrologerData}/>
          {/* <Categories /> */}
          <LifeGuidance />
          <FAQSection />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  let profileData = null;
  let astrologerData = [];
  let serverIsLoggedIn = false;

  try {
    try {
      const { response } = await serverFetchWithAuth(
        config.getClientProfile,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        },
        { req: context.req, res: context.res }
      );

      if (response.ok) {
        const profileRes = await response.json();
        profileData = profileRes?.success
          ? stripAuthFields(profileRes.data)
          : null;
        serverIsLoggedIn = !!profileData;
      }
    } catch (error) {
      console.log("Get Profile Error:", error);
    }

    // =========================
    // Astrologers API
    // =========================
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

      const res =
        await response.json();

      astrologerData =
        res?.data || [];
    } catch (error) {
      console.log(
        "Get Astrologers Error:",
        error
      );

      astrologerData = [];
    }

    // =========================
    // Final Return
    // =========================
      return {
        props: {
          serverIsLoggedIn,
          profileData,
          astrologerData,
        },
    };
  } catch (error) {
    console.log(
      "SSR Error:",
      error
    );

    return {
      props: {
        serverIsLoggedIn: false,
        profileData: null,
        astrologerData: [],
      },
    };
  }
}
