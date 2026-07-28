"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import KundaliPdfPage from "@/components/Kundali/KundaliPdfPage";
import PageLayout from "@/components/PageLayout";

export default function AstrologerKundaliPdfPage() {
  return (
    <PageLayout title="Kundali PDF" icon="📄">
      <KundaliPdfPage theme="astrologer" />
      <ToastContainer position="top-right" autoClose={3000} />
    </PageLayout>
  );
}
