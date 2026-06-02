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

import { useEffect, useState } from "react";
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
  // ✅ Sidebar state (BOOLEAN only)
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ✅ Toggle sidebar
  const handleOpenSidebar = () => {
    setSidebarOpen((value) => !value);
  };


  // ✅ Logged-in dashboard
  if (isLoggedIn) {
    return (
      <DashboardPage
        sidebarOpen={sidebarOpen}
        handleOpenSidebar={handleOpenSidebar}
        profileData={profileData}
        astrologerData={astrologerData}
      />
    );
  }

  // ✅ Pre-login public page
  return (
    <div className="min-h-screen dashboard-bg text-white">
      {/* OVERLAY PANELS */}
      <ChatPanel />
      <NotificationPanel />

      <div className="flex flex-col lg:flex-row">
        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 p-3 sm:p-4 md:p-6 space-y-4">
          <Header/>
          <Hero />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <QuickActions />
            <PlanetaryHighlights
              isLoggedIn={isLoggedIn}
            />
          </div>

          <Astrologers limit={3} astrologerData={astrologerData}/>
          <Categories />
          <LifeGuidance />
        </div>

        {/* RIGHT SIDEBAR */}
        <Sidebar />
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
