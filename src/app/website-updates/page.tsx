"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Loading from "@/app/components/layout/Loading";

interface WebsiteModule {
  title: string;
  description: string;
  icon: string;
  href: string;
  category: string;
  color: string;
}

export default function WebsiteUpdatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router, session]);

  if (status === "loading") {
    return <Loading />;
  }

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Website Updates" },
  ];

  const categories = [
    { id: "all", label: "All Updates" },
    { id: "announcements", label: "Announcements" },
    { id: "images", label: "Slider Images" },
    { id: "profiles", label: "People Profiles" },
    { id: "statistics", label: "Placement Statistics" },
  ];

  const modules: WebsiteModule[] = [
    {
      title: "Announcements",
      description: "Manage announcements for the department website",
      icon: "🔔",
      href: "/website-updates/announcements",
      category: "announcements",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: "News",
      description: "Manage latest news for the department website",
      icon: "📰",
      href: "/website-updates/news",
      category: "announcements",
      color: "bg-gradient-to-br from-blue-400 to-orange-600",
    },
    {
      title: "Newsletter",
      description: "Create and manage department newsletters",
      icon: "📧",
      href: "/website-updates/newsletter",
      category: "announcements",
      color: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: "Slider Images",
      description: "Manage slider images for the department website",
      icon: "🖼️",
      href: "/website-updates/slider-images",
      category: "images",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      title: "Faculty Information",
      description: "Manage faculty profiles and information",
      icon: "👤",
      href: "/website-updates/faculty-information",
      category: "profiles",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      title: "Staff Information",
      description: "Manage staff profiles and information",
      icon: "👤",
      href: "/website-updates/staff-information",
      category: "profiles",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      title: "Scholar Information",
      description: "Manage research scholar profiles and information",
      icon: "👤",
      href: "/website-updates/scholar-information",
      category: "profiles",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      title: "Student Information",
      description: "Manage student profiles and information",
      icon: "👤",
      href: "/website-updates/student-information",
      category: "profiles",
      color: "bg-gradient-to-br from-violet-400 to-violet-600",
    },
    {
      title: "Graduands Information",
      description: "Manage graduands profiles and information",
      icon: "👤",
      href: "/website-updates/graduands-information",
      category: "profiles",
      color: "bg-gradient-to-br from-violet-400 to-violet-600",
    },
    {
      title: "Placement Statistics",
      description: "Manage placement and recruitment statistics",
      icon: "📊",
      href: "/website-updates/placement-statistics",
      category: "statistics",
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
    },
  ];

  const filteredModules =
    activeTab === "all"
      ? modules
      : modules.filter((module) => module.category === activeTab);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Activity Portal", href: "/activity-portal" },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const handleModuleClick = (module: WebsiteModule) => {
    router.push(module.href);
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
              Website Updates
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and update content for the department website
            </p>
          </div>

          {/* Category Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === category.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Module Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredModules.map((module) => (
              <div
                key={module.title}
                className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleModuleClick(module)}
              >
                <div className={`p-6 ${module.color} text-white h-full`}>
                  <div className="flex justify-between items-start">
                    <span className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
                      {module.icon}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/90">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
