"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KundaliMatchingPage from "@/components/KundaliMatching/KundaliMatchingPage";
import PageLayout from "@/components/PageLayout";

export default function AstrologerKundaliMatchingPage() {
  return (
    <PageLayout title="Kundali Matching" icon="🤝">
      <KundaliMatchingPage theme="astrologer" />
      <ToastContainer position="top-right" autoClose={3000} />
    </PageLayout>
  );
}
