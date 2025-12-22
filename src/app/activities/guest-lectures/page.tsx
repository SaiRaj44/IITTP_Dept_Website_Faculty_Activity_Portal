"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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

interface GuestLecture {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  institution: string;
  startDate: string;
  endDate: string;
  year: string;
  date: string;
  createdBy: string;
  published: boolean;
}

export default function GuestLecturesPage() {
  const [lectures, setLectures] = useState<GuestLecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [years, setYears] = useState<string[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Generate years from 2017 to current year in reverse order
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearRange = Array.from({ length: currentYear - 2016 }, (_, i) =>
      (currentYear - i).toString()
    );
    setYears(yearRange);
  }, []);

  // Fetch available years from the API
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        // Make a minimal request just to get the filters
        const response = await fetch(
          `/api/public/lectures-delivered?limit=1`
        );
        const data = await response.json();

        if (
          data.filters &&
          data.filters.year &&
          Array.isArray(data.filters.year)
        ) {
          // Sort years in descending order
          const sortedYears = [...data.filters.year].sort(
            (a, b) => parseInt(b) - parseInt(a)
          );
          setAvailableYears(sortedYears);
        }
      } catch (err) {
        console.error("Error fetching available years:", err);
      }
    };

    fetchAvailableYears();
  }, []);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        // Build the URL with appropriate query parameters
        let url = `/api/public/lectures-delivered?page=${currentPage}&limit=${pagination.limit}`;

        // Add year filter if selected
        if (selectedYear) {
          url += `&year=${encodeURIComponent(selectedYear)}`;
        }

        // Add search term if present
        if (searchTerm) {
          url += `&query=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setLectures(data.data);
          setPagination(data.pagination);

          // If we're fetching the first page and there's no selected year,
          // use this opportunity to update the available years from filters
          if (
            currentPage === 1 &&
            !selectedYear &&
            data.filters &&
            data.filters.year
          ) {
            const sortedYears = [...data.filters.year].sort(
              (a, b) => parseInt(b) - parseInt(a)
            );
            setAvailableYears(sortedYears);
          }
        } else {
          setError("Failed to fetch guest lectures");
        }
      } catch (err) {
        setError("Error fetching guest lectures");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, [currentPage, selectedYear, pagination.limit, searchTerm]);

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
      <div className="relative bg-indigo-800 text-white py-20">
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
              Special / Guest Lectures
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              The faculties are actively involved in delivering special/Guest
              Lectures outside IIT Tirupati and they have given invited talks in
              following institutions IIT Jodhpur, IIT Indore, IIT Varanasi,
              SRIT, COL, CEMCA, KSRM, MVSR, HPC Shiksha, SRM, ACM, MGIT, IETE,
              VIT, JNTU, NIT Kurushektra The year wise guest lectures delivered
              are given below:
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
                    placeholder="Search lectures..."
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

              {/* Year Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Year
                </h3>
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      checked={selectedYear === null}
                      onChange={() => {
                        setSelectedYear(null);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="year"
                    />
                    <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                      All Years
                    </span>
                  </label>
                  {availableYears.length > 0
                    ? availableYears.map((year) => (
                        <label
                          key={year}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            checked={selectedYear === year}
                            onChange={() => {
                              setSelectedYear(year);
                              setCurrentPage(1);
                            }}
                            className="text-blue-600 focus:ring-blue-500"
                            name="year"
                          />
                          <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                            {year}
                          </span>
                        </label>
                      ))
                    : years.map((year) => (
                        <label
                          key={year}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            checked={selectedYear === year}
                            onChange={() => {
                              setSelectedYear(year);
                              setCurrentPage(1);
                            }}
                            className="text-blue-600 focus:ring-blue-500"
                            name="year"
                          />
                          <span className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                            {year}
                          </span>
                        </label>
                      ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Lectures List */}
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
            ) : lectures.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No guest lectures found
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {lectures.map((lecture) => (
                  <motion.div
                    key={lecture._id}
                    variants={fadeIn}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-base leading-relaxed font-normal text-gray-900 font-base">
                          <span className="text-blue-600 font-medium">
                            {lecture.facultyInvolved.map((faculty) =>
                              faculty.institute ? (
                                <Link
                                  key={faculty.institute}
                                  href={`/people/faculty/${faculty.institute}`} target="_blank"
                                  className="hover:text-blue-800 hover:underline"
                                >
                                  {faculty.name}
                                </Link>
                              ) : (
                                faculty.name
                              )
                            )}
                          </span>
                          {lecture.facultyInvolved.length > 0 && ", "}
                          <span className="italic text-blue-500">
                            &ldquo;{lecture.title}&rdquo;
                          </span>
                          {lecture.institution && (
                            <span className="text-gray-700">
                              , {lecture.institution}
                            </span>
                          )}
                          {lecture.startDate && (
                            <span className="text-gray-600">
                              ,{" "}
                              {new Date(lecture.startDate).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full shadow-sm hover:bg-blue-100 transition-colors">
                          {lecture.year}
                        </span>
                      </div>
                    </div>
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
