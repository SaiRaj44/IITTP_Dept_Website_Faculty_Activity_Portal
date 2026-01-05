"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrophyIcon,
  UserGroupIcon,
  UserIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

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

interface Faculty {
  name: string;
  institute?: string;
}

interface Honour {
  _id: string;
  category: "Award" | "Recognition";
  facultyInvolved: Faculty[];
  awardName: string;
  person: "Faculty" | "Student";
  awardBy: string;
  awardFor: string;
  imgUrl: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function AwardsHonoursPage() {
  const [honours, setHonours] = useState<Honour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 9,
    pages: 0,
  });

  useEffect(() => {
    const fetchHonours = async () => {
      try {
        setLoading(true);
        let url = `/api/public/honours-awards?page=${currentPage}&limit=${pagination.limit}`;

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        // console.log("Fetching from URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setHonours(data.data);
          setPagination(data.pagination);

          // console.log(
          //   `Found ${data.data.length} honours with filter:`,
          //   selectedCategory || "All"
          // );
        } else {
          setError("Failed to fetch honours and awards");
        }
      } catch (err) {
        setError("Error fetching honours and awards");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHonours();
  }, [currentPage, selectedCategory, pagination.limit]);

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
              Awards & Honours
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Celebrating the achievements and recognitions of our faculty and
              students
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Category
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      checked={selectedCategory === null}
                      onChange={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      name="category"
                      suppressHydrationWarning
                    />
                    <span className="text-sm font-medium text-gray-700">
                      All Categories
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      checked={selectedCategory === "Award"}
                      onChange={() => {
                        setSelectedCategory("Award");
                        setCurrentPage(1);
                      }}
                      className="text-yellow-500 focus:ring-yellow-500 h-4 w-4"
                      name="category"
                      suppressHydrationWarning
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-2"></span>
                      Awards
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      checked={selectedCategory === "Recognition"}
                      onChange={() => {
                        setSelectedCategory("Recognition");
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                      name="category"
                      suppressHydrationWarning
                    />
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-100 border border-blue-300 mr-2"></span>
                      Recognitions
                    </span>
                  </label>
                </div>
              </div>

              {/* Person Filter */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {/* Active Filter Indicator */}
            {selectedCategory && (
              <div className="mb-6 bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-blue-800 font-medium">
                    Active Filter:
                  </span>
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                      selectedCategory === "Award"
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {selectedCategory}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}

            {/* Honours Grid */}
            {!loading && !error && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {honours.length > 0 ? (
                  honours.map((honour) => (
                    <motion.div
                      key={honour._id}
                      variants={fadeIn}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full relative"
                      whileHover={{
                        y: -10,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        transition: { duration: 0.3 },
                      }}
                    >
                      {/* Category Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                            honour.category === "Award"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {honour.category}
                        </span>
                      </div>

                      {/* Circular Image */}
                      <div className="relative mx-auto mt-8 mb-2">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          <Image
                            src={honour.imgUrl}
                            alt={honour.awardName}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Decorative ring (Static) */}
                        <div className="absolute inset-0 w-32 h-32 rounded-full border-2 border-blue-400 -z-10" />
                      </div>

                      {/* Honour Content */}
                      <div className="p-6 flex-grow flex flex-col text-center">
                      <h2
                          className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2 hover:text-blue-600 transition-colors "
                          title={honour.awardName}
                        >
                          {honour.awardName}
                        </h2>

                        {/* Award By */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 mb-1">
                            Awarded By
                          </h3>
                          <p className="text-sm text-gray-600">
                            {honour.awardBy}
                          </p>
                        </div>

                        {/* Faculty/Student Details */}
                        {honour.facultyInvolved.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-1">
                              {honour.person === "Faculty"
                                ? "Faculty Member"
                                : "Faculty Guide & Students"}
                            </h3>
                            <ul className="text-sm text-gray-600 flex flex-wrap justify-center gap-1">
                              {honour.facultyInvolved.map((faculty, index) => (
                                <li key={index} className="inline-block">
                                  {faculty.institute ? (
                                    <Link
                                      href={`/people/faculty/${faculty.institute}`}
                                      target="_blank"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      {faculty.name}
                                    </Link>
                                  ) : (
                                    faculty.name
                                  )}
                                  {index < honour.facultyInvolved.length - 1 &&
                                    ", "}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Info Section */}
                        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                          {/* Person Type */}
                          <div className="flex flex-col items-center">
                            {honour.person === "Faculty" ? (
                              <UserIcon className="h-5 w-5 text-blue-500 mb-1" />
                            ) : (
                              <UserGroupIcon className="h-5 w-5 text-blue-500 mb-1" />
                            )}
                            <span className="text-xs text-gray-500">
                              {honour.person}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="flex flex-col items-center">
                            <CalendarIcon className="h-5 w-5 text-blue-500 mb-1" />
                            <span className="text-xs text-gray-500">
                              {new Date(honour.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <div className="bg-blue-50 rounded-lg p-8 max-w-lg mx-auto">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 10, 0] }}
                        transition={{ duration: 1, repeat: 1 }}
                      >
                        <TrophyIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No awards or honours found
                      </h3>
                      <p className="text-gray-600">
                        No awards or honours match your current search criteria.
                        Try adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading &&
              !error &&
              honours.length > 0 &&
              pagination.pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(currentPage - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      suppressHydrationWarning
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    {Array.from(
                      { length: pagination.pages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === page
                            ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                        }`}
                        suppressHydrationWarning
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        handlePageChange(
                          Math.min(currentPage + 1, pagination.pages)
                        )
                      }
                      disabled={currentPage === pagination.pages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                        currentPage === pagination.pages
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }`}
                      suppressHydrationWarning
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
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
