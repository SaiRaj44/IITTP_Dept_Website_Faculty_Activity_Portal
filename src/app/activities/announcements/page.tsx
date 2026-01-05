"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  time: string;
  isActive: boolean;
  priority: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

// Move defaultCategories outside the component
const defaultCategories = [
  "News",
  "Academic",
  "Events",
  "Important",
  "General",
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        let url = `/api/public/announcements?page=${currentPage}&limit=${pagination.limit}`;

        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        if (searchTerm) {
          url += `&query=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setAnnouncements(data.data);
          // Extract unique categories from announcements
          const uniqueCategories = Array.from(
            new Set(
              data.data.map(
                (announcement: Announcement) => announcement.category
              )
            )
          ).filter((category): category is string => Boolean(category));
          setCategories(
            uniqueCategories.length > 0 ? uniqueCategories : defaultCategories
          );
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch announcements");
        }
      } catch (err) {
        setError("Error fetching announcements");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [currentPage, selectedCategory, pagination.limit, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-24">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Announcements
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Latest updates and important information from the department
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Search Box */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      checked={selectedCategory === null}
                      onChange={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="category"
                    />
                    <span className="text-sm text-gray-700">
                      All Categories
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="radio"
                        checked={selectedCategory === category}
                        onChange={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                        name="category"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Announcements List */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mt-4"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : announcements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No announcements found
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {announcements.map((announcement) => (
                  <motion.div
                    key={announcement._id}
                    variants={fadeIn}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {announcement.content}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(
                                announcement.startDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                announcement.endDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          {announcement.location && announcement.location !== "-" && (
  <div className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
    <span>{announcement.location}</span>
  </div>
)}

{announcement.time && announcement.time !== "-" && (
  <div className="flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{announcement.time}</span>
  </div>
)}

                          {announcement.priority && (
                            <div className="flex items-center">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  announcement.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : announcement.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {announcement.priority} Priority
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {announcement.category && (
                        <span className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full">
                          {announcement.category}
                        </span>
                      )}
                    </div>
                    {announcement.attachmentUrl && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Attachment:
                        </h4>
                        <a
                          href={announcement.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          View Attachment
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
