"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import PlanetaryHighlights from "@/components/PlanetaryHighlights";
import Astrologers from "@/components/Astrologers";
import Categories from "@/components/Categories";
import LifeGuidance from "@/components/LifeGuidance";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import NotificationPanel from "@/components/NotificationPanel";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";

export default function DashboardPage({ profileData, astrologerData }) {
  return (
    <>
      <ChatPanel />
      <NotificationPanel />

      <div className="min-h-screen dashboard-bg p-3 text-[#1f1608] sm:p-4 md:p-6">
        <div className="mx-auto w-full max-w-[1500px]">
              <main className="min-w-0 flex-1 space-y-4">
                <Header profileData={profileData} />
                <Hero profileData={profileData}/>

                {/* <PlanetaryHighlights />
                <QuickActions />
                <Sidebar /> */}

                <div className="flex w-full flex-col gap-4 lg:flex-row">
                          <div className="dashboard-feature-panel w-full space-y-4 rounded-xl bg-white p-3 shadow-xl sm:p-5 lg:w-[70%]">
                          <PlanetaryHighlights/>
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
    </>
  );
}
