"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Loading from "@/app/components/layout/Loading";

interface Activity {
  title: string;
  description: string;
  href: string;
  icon: string;
  category: string;
  color: string;
  count?: number;
}

export default function ActivityPortalPage() {
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
    { label: "Activity Portal" },
  ];

  const activities: Activity[] = [
    {
      title: "Attended Events",
      description: "Track attended events",
      href: "/activity-portal/attended-events",
      icon: "👥",
      category: "events",
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      title: "Publications",
      description: "Track published papers",
      href: "/activity-portal/publications",
      icon: "📄",
      category: "research",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      title: "Books",
      description: "Track published books and chapters",
      href: "/activity-portal/books",
      icon: "📖",
      category: "research",
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
    },
    {
      title: "Equipment",
      description: "Manage laboratory equipment and facilities",
      href: "/activity-portal/equipments",
      icon: "🔧",
      category: "infrastructure",
      color: "bg-gradient-to-br from-red-400 to-red-600",
    },
    {
      title: "Fellowships",
      description: "Track fellowships and awards",
      href: "/activity-portal/fellowships",
      icon: "🏆",
      category: "honours",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      title: "Honours & Awards",
      description: "Track honours and awards",
      href: "/activity-portal/honours-awards",
      icon: "🏆",
      category: "honours",
      color: "bg-gradient-to-br from-teal-400 to-teal-600",
    },
    {
      title: "Journal Editorial Boards",
      description: "Manage journal editorial board memberships",
      href: "/activity-portal/journal-editorial-boards",
      icon: "📰",
      category: "research",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    },
    {
      title: "MoUs",
      description: "Track Memorandums of Understanding",
      href: "/activity-portal/mou",
      icon: "📋",
      category: "network",
      color: "bg-gradient-to-br from-teal-400 to-teal-600",
    },
    {
      title: "Organized Events",
      description: "Track organized events",
      href: "/activity-portal/organized-events",
      icon: "🎉",
      category: "events",
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      title: "Patents",
      description: "Manage patent records and submissions",
      href: "/activity-portal/patents",
      icon: "📜",
      category: "research",
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      title: "Projects",
      description: "Manage projects",
      href: "/activity-portal/projects",
      icon: "🏗️",
      category: "funding",
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      title: "Sponsored Projects",
      description: "Manage sponsored research projects",
      href: "/activity-portal/sponsored-projects",
      icon: "🔬",
      category: "funding",
      color: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: "Software Designed",
      description: "Track software designed",
      href: "/activity-portal/software-designed",
      icon: "💻",
      category: "infrastructure",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    },
    {
      title: "Lectures Delivered",
      description: "Track lectures delivered",
      href: "/activity-portal/lectures-delivered",
      icon: "🎤",
      category: "events",
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    },
    {
      title: "Visitors",
      description: "Manage visiting faculty and researchers",
      href: "/activity-portal/visitors",
      icon: "👥",
      category: "network",
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      title: "Visits Abroad",
      description: "Track international visits and collaborations",
      href: "/activity-portal/visit-abroad",
      icon: "✈️",
      category: "network",
      color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    },
  ];

  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((activity) => activity.category === activeTab);

  const categories = [
    { id: "all", label: "All Activities" },
    { id: "events", label: "Events" },
    { id: "funding", label: "Projects & Funding" },
    { id: "honours", label: "Honours & Awards" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "network", label: "Network & Collaboration" },
    { id: "research", label: "Research & Publications" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Activity Portal", href: "/activity-portal", active: true },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin" });
  };

  const handleActivityClick = (activity: Activity) => {
    router.push(activity.href);
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
              Activity Portal
            </h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your research activities in one place
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

          {/* Activity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity) => (
              <div
                key={activity.title}
                className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => handleActivityClick(activity)}
              >
                <div className={`p-6 ${activity.color} text-white h-full`}>
                  <div className="flex justify-between items-start">
                    <span className="text-4xl w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
                      {activity.icon}
                    </span>
                    {activity.count && (
                      <span className="bg-white text-blue-600 rounded-full px-2.5 py-1 text-xs font-medium">
                        {activity.count}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {activity.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/90">
                    {activity.description}
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