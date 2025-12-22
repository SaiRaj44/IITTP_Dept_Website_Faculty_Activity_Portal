"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
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
  _id: string;
}

interface Project {
  _id: string;
  category:
    | "RBIC Project"
    | "Industrial Consultancy"
    | "Consultancy Project"
    | "Sponsored Project";
  title: string;
  facultyInvolved: Faculty[];
  year: string;
  industry: string;
  amount: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    pages: 0,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let url = `/api/public/projects?page=${currentPage}&limit=12`;

        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }

        if (selectedYear) {
          url += `&year=${encodeURIComponent(selectedYear)}`;
        }

        // console.log("Fetching URL:", url); // Debug log

        const response = await fetch(url);
        const data = await response.json();

        // console.log("API Response:", data); // Debug log

        if (data.data) {
          setProjects(data.data);
          if (data.filters) {
            if (data.filters.category) {
              // console.log("Categories from API:", data.filters.category); // Debug log
              setCategories(data.filters.category);
            }
            if (data.filters.year) {
              // console.log("Years from API:", data.filters.year); // Debug log
              setYears(data.filters.year);
            }
          }
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch projects");
        }
      } catch (err) {
        setError("Error fetching projects");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, selectedCategory, selectedYear]);

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
              Research Projects
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Our ongoing and completed research projects in Computer Science &
              Engineering
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
              {/* Years Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Years/ Duration
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="radio"
                      checked={selectedYear === null}
                      onChange={() => {
                        setSelectedYear(null);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="year"
                      suppressHydrationWarning
                    />
                    <span className="text-sm text-gray-700">All Years</span>
                  </label>
                  {years.map((year) => (
                    <label
                      key={year}
                      className="flex items-center space-x-2 cursor-pointer"
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
                        suppressHydrationWarning
                      />
                      <span className="text-sm text-gray-700">{year}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="radio"
                      checked={selectedCategory === null}
                      onChange={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="category"
                      suppressHydrationWarning
                    />
                    <span className="text-sm text-gray-700">
                      All Categories
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer"
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
                        suppressHydrationWarning
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            {/* Active Filters Indicator */}
            {(selectedCategory || selectedYear) && (
              <div className="mb-6 bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-800 font-medium">
                    Active Filters:
                  </span>
                  {selectedCategory && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedYear && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedYear}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedYear(null);
                    setCurrentPage(1);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Filters
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

            {/* Projects Grid */}
            {!loading && !error && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <motion.div
                      key={project._id}
                      variants={fadeIn}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      {/* Project Content */}
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="mb-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              project.category === "RBIC Project"
                                ? "bg-purple-100 text-purple-800"
                                : project.category === "Industrial Consultancy"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {project.category}
                          </span>
                        </div>

                        <h2
                          className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2"
                          title={project.title}
                        >
                          {project.title}
                        </h2>

                        {/* Faculty Involved */}
                        <div className="flex items-start space-x-2 mb-4">
                          <UserGroupIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-1">
                              Faculty Involved
                            </h3>
                            <ul className="text-sm text-gray-600">
                              {project.facultyInvolved.map((faculty, index) => (
                                <li key={index} className="pb-1">
                                  {faculty.institute ? (
                                    <Link
                                      key={faculty._id}
                                      href={`/people/faculty/${faculty.institute}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                                    >
                                      {" "}
                                      {faculty.name}
                                    </Link>
                                  ) : (
                                    faculty.name
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Industry */}
                        <div className="flex items-start space-x-2 mb-4">
                          <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Industry/ Funding Agency
                            </h3>
                            <p className="text-sm text-gray-600">
                              {project.industry}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="flex items-start space-x-2 mb-4">
                          <CurrencyRupeeIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Project Amount
                            </h3>
                            <p className="text-sm text-gray-600">
                              {project.amount}
                            </p>
                          </div>
                        </div>

                        {/* Year */}
                        <div className="flex items-start space-x-2">
                          <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Year/ Duration
                            </h3>
                            <p className="text-sm text-gray-600">
                              {project.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <div className="bg-blue-50 rounded-lg p-8 max-w-lg mx-auto">
                      <BriefcaseIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No projects found
                      </h3>
                      <p className="text-gray-600">
                        No projects match your current search criteria. Try
                        adjusting your filters.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading &&
              !error &&
              projects.length > 0 &&
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
