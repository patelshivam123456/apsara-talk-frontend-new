"use client";

import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import NotificationPanel from "@/components/NotificationPanel";
import Footer from "@/components/Footer";

export default function PublicPageLayout({
  eyebrow,
  title,
  description,
  children,
  actions,
  profileData,
}) {
  return (
    <div className="min-h-screen dashboard-bg text-[#1f1608]">
      <ChatPanel />
      <NotificationPanel />

      <div className="mx-auto w-full max-w-[1500px] p-3 sm:p-4 md:p-6">
        <main className="min-w-0 flex-1 space-y-4">
          <Header profileData={profileData} />

          <section className="relative overflow-hidden rounded-[28px] border border-[#eadcae] bg-[#fff9e9] p-4 shadow-[0_22px_70px_rgba(87,60,12,0.12)] sm:p-6 lg:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,#fffdf4_0%,#fff6da_52%,#f5e4b3_100%)]" />
            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[#d9b857]/30" />
            <div className="pointer-events-none absolute -right-10 top-10 h-44 w-44 rounded-full border border-[#d9b857]/25" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                {eyebrow && (
                  <p className="inline-flex rounded-full border border-[#d3ae4f]/45 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#916805] shadow-sm">
                    {eyebrow}
                  </p>
                )}
                <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.05] text-[#1d1607] sm:text-[2.6rem] lg:text-[3.15rem]">
                  {title}
                </h1>
                {description && (
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#60481f] sm:text-[15px]">
                    {description}
                  </p>
                )}
              </div>

              {actions && (
                <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                  {actions}
                </div>
              )}
            </div>
          </section>

          {children}

          <Footer />
        </main>
      </div>
    </div>
  );
}
