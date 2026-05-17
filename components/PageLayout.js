"use client";

import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";

export default function PageLayout({ title, icon, children, protect = true }) {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    if (protect && !isLoggedIn) router.replace("/login");
  }, [isLoggedIn, protect]);

  if (protect && !isLoggedIn) return null;

  return (
    <div className="min-h-screen dashboard-bg text-white flex">
      {/* Left sidebar */}
      <AppSidebar currentRoute={router.pathname} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top nav bar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 pl-16 lg:pl-6">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-300 hover:text-white text-lg shrink-0"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 px-4 sm:px-6 pb-6 pl-16 lg:pl-6">
          {children}
        </div>
      </div>
    </div>
  );
}
