"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AstroProfilePage from "@/components/AstroProfile/AstroProfilePage";
import PageLayout from "@/components/PageLayout";

export default function AstrologerAstroProfilePage() {
  return (
    <PageLayout title="Apsara Astro Profile" icon="🔭">
      <AstroProfilePage theme="astrologer" />
      <ToastContainer position="top-right" autoClose={3000} />
    </PageLayout>
  );
}
