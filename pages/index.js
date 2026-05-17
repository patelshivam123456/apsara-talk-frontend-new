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
import { useSelector } from "react-redux";

export default function Home({ serverIsLoggedIn }) {

  // ✅ Sidebar state (BOOLEAN only)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redux state takes over after hydration; server prop covers the first render
  const { isLoggedIn: reduxIsLoggedIn } = useSelector((state) => state.auth);
  const isLoggedIn = reduxIsLoggedIn || serverIsLoggedIn;

  // ✅ Load from localStorage on first render
  useEffect(() => {
    const savedSidebar = localStorage.getItem("sidebarOpen");
    if (savedSidebar !== null) {
      setSidebarOpen(JSON.parse(savedSidebar));
    }
  }, []);

  // ✅ Toggle sidebar
  const handleOpenSidebar = () => {
    const updatedValue = !sidebarOpen;
    setSidebarOpen(updatedValue);
    localStorage.setItem("sidebarOpen", JSON.stringify(updatedValue));
  };

  // ✅ Logged-in dashboard
  if (isLoggedIn) {
    return (
      <DashboardPage
        sidebarOpen={sidebarOpen}
        handleOpenSidebar={handleOpenSidebar}
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
          <Header />
          <Hero />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <QuickActions />
            <PlanetaryHighlights isLoggedIn={isLoggedIn}/>
          </div>

          <Astrologers limit={3} />
          <Categories />
          <LifeGuidance />
        </div>

        {/* RIGHT SIDEBAR */}
        <Sidebar />
      </div>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const serverIsLoggedIn = req.cookies?.isLoggedIn === "1";
  return { props: { serverIsLoggedIn } };
}
