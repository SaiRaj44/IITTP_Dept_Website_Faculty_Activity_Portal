"use client";

import React from "react";
import { signOut } from "next-auth/react";
import Header from "@/app/components/layout/Header";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Loading from "@/app/components/layout/Loading";
import Footer from "@/app/components/layout/Footer";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router, session]);

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Dashboard" },
  ];

  const navItems = [
    
    { name: "Dashboard", href: "/dashboard", active: true },
    { name: "Activity Portal", href: "/activity-portal" },
  ];

  if (status === "loading") {
    return <Loading />;
  }
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header navItems={navItems} onSignOut={handleSignOut} />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbsItems.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <>
                        <Link
                          href={item.href}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {item.label}
                        </Link>
                        <span className="mx-2 text-gray-400">/</span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage user statistics displayed on the department website
            </p>
          </div>

          
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;