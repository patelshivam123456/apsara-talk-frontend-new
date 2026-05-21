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

  // ✅ Load from localStorage on first render
  useEffect(() => {
    const savedSidebar =
      localStorage.getItem("sidebarOpen");

    if (savedSidebar !== null) {
      setSidebarOpen(JSON.parse(savedSidebar));
    }
  }, []);

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
    const updatedValue = !sidebarOpen;

    setSidebarOpen(updatedValue);

    localStorage.setItem(
      "sidebarOpen",
      JSON.stringify(updatedValue)
    );
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

// export async function getServerSideProps({ req }) {
//   const serverIsLoggedIn =
//     req.cookies?.isLoggedIn === "1";

//   let profileData = null;

//   try {
//     // ✅ token from cookie
//     const token = req.cookies?.token;
//     console.log(token,"///////////////");
    

//     if (token) {
//       const response = await fetch(
//         config.getClientProfile,
//         {
//           method: "GET",
//           headers: {
//             accept: "*/*",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const res = await response.json();

//       if (res?.success) {
//         profileData = res?.data;
//       }
//     }
//   } catch (error) {
//     console.log(
//       "Profile API Error:",
//       error
//     );
//   }

//   return {
//     props: {
//       serverIsLoggedIn,
//       profileData,
//     },
//   };
// }

export async function getServerSideProps({ req }) {
  const serverIsLoggedIn =
    req.cookies?.isLoggedIn === "1";

  let profileData = null;
  let astrologerData = [];

  try {
    const token = req.cookies?.token;

    // =========================
    // Profile API ONLY if logged in
    // =========================
    if (token) {
      try {
        const profileResponse = await fetch(
          config.getClientProfile,
          {
            method: "GET",
            headers: {
              accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Unauthorized → treat as guest user
        if (profileResponse.status !== 401) {
          const profileRes =
            await profileResponse.json();

          if (profileRes?.success) {
            profileData =
              profileRes?.data;
          }
        }
      } catch (error) {
        console.log(
          "Profile API Error:",
          error
        );
      }
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
            // Authorization: `Bearer ${
            //   token || ""
            // }`,
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