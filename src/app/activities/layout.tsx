"use client";

import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header - Using the reusable component */}
      <Header />

      {/* Main content */}
      <main>{children}</main>

      {/* Footer - Using the reusable component */}
      <Footer />
    </div>
  );
} 