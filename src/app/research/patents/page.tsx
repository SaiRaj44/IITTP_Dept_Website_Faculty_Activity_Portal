"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  DocumentIcon,
  UserGroupIcon,
  MapIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon
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

interface FacultyMember {
  name: string;
  institute: string;
  _id: string;
}

interface Patent {
  _id: string;
  title: string;
  facultyInvolved: FacultyMember[];
  patentNumber: string;
  applicationNumber: string;
  filingDate: string;
  grantDate: string | null;
  status: string;
  description: string;
  organization: string;
  country: string;
  date: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function PatentsPage() {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    status: string[];
    // country: string[];
  }>({
    status: [],
    // country: [],
  });
  const [selectedFilter, setSelectedFilter] = useState<{
    type: "status" |  null;
    value: string | null;
  }>({
    type: null,
    value: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    const fetchPatents = async () => {
      try {
        setLoading(true);
        let url = `/api/public/patents?page=${currentPage}&limit=${pagination.limit}`;

        // Add filters
        if (selectedFilter.type && selectedFilter.value) {
          url += `&${selectedFilter.type}=${selectedFilter.value}`;
        }

        // Add search term
        if (searchTerm) {
          url += `&query=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setPatents(data.data);
          setFilters(data.filters || { status: [], country: [] });
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch patents");
        }
      } catch (err) {
        setError("Error fetching patents");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatents();
  }, [currentPage, selectedFilter, pagination.limit, searchTerm]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "granted":
        return "bg-green-100 text-green-800";
      case "filed":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          {" "}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Patents</h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Innovations and intellectual property developed by our researchers
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
                    placeholder="Search patents..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-blue-500 focus:border-blue-500"
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

              {/* Status Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Status
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="radio"
                      checked={selectedFilter.type !== "status"}
                      onChange={() => {
                        setSelectedFilter({ type: null, value: null });
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="status"
                    />
                    <span className="text-sm text-gray-700">All Status</span>
                  </label>
                  {filters.status.map((status) => (
                    <label
                      key={status}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={
                          selectedFilter.type === "status" &&
                          selectedFilter.value === status
                        }
                        onChange={() => {
                          setSelectedFilter({ type: "status", value: status });
                          setCurrentPage(1);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                        name="status"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              {/* <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Country
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <input
                      type="radio"
                      checked={selectedFilter.type !== "country"}
                      onChange={() => {
                        setSelectedFilter({ type: null, value: null });
                        setCurrentPage(1);
                      }}
                      className="text-blue-600 focus:ring-blue-500"
                      name="country"
                    />
                    <span className="text-sm text-gray-700">All Countries</span>
                  </label>
                  {filters.country.map((country) => (
                    <label
                      key={country}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        checked={
                          selectedFilter.type === "country" &&
                          selectedFilter.value === country
                        }
                        onChange={() => {
                          setSelectedFilter({
                            type: "country",
                            value: country,
                          });
                          setCurrentPage(1);
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                        name="country"
                      />
                      <span className="text-sm text-gray-700">{country}</span>
                    </label>
                  ))}
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Content - Patents List */}
          <div className="flex-1">
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

            {/* Empty State */}
            {!loading && !error && patents.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 max-w-lg mx-auto">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="text-gray-600 mb-2">No patents found</p>
                  <p className="text-gray-500 text-sm">
                    No patents are available at this time.
                  </p>
                </div>
              </div>
            )}

            {/* Patents List */}
            {!loading && !error && patents.length > 0 && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-6"
              >
                {patents.map((patent) => (
                  <motion.div
                    key={patent._id}
                    variants={fadeIn}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-center justify-between mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            patent.status
                          )} mb-2 sm:mb-0`}
                        >
                          {patent.status}
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapIcon className="h-4 w-4" />
                          <span>{patent.country}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {patent.title}
                      </h3>

                      {patent.patentNumber && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <DocumentIcon className="h-4 w-4" />
                          <span>
                            <span className="font-medium">Patent Number:</span>{" "}
                            {patent.patentNumber}
                          </span>
                        </div>
                      )}
                      {patent.organization && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <BuildingOfficeIcon className="h-4 w-4" />
                          <span>
                            <span className="font-medium">Organization:</span>{" "}
                            {patent.organization}
                          </span>
                        </div>
                      )}

                      {patent.applicationNumber && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <DocumentTextIcon className="h-4 w-4" />
                          <span>
                            <span className="font-medium">
                              Application Number:
                            </span>{" "}
                            {patent.applicationNumber}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                        {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            <span className="font-medium">Filing Date:</span>{" "}
                            {formatDate(patent.filingDate)}
                          </span>
                        </div> */}

                        {patent.grantDate && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <CheckBadgeIcon className="h-4 w-4" />
                            <span>
                              <span className="font-medium">Grant Date:</span>{" "}
                              {formatDate(patent.grantDate)}
                            </span>
                          </div>
                        )}
                      </div>

                      {patent.description && (
                        <div className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-md">
                          <p className="font-medium mb-1">Description:</p>
                          <p>{patent.description}</p>
                        </div>
                      )}

                      {patent.facultyInvolved &&
                        patent.facultyInvolved.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-start">
                              <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-500 mb-1">
                                  Inventors:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {patent.facultyInvolved.map(
                                      (faculty) =>
                                        faculty.institute ? (
                                          <Link
                                            key={faculty._id}
                                            href={`/people/faculty/${faculty.institute}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                                          >
                                            {faculty.name}
                                          </Link>
                                        ) : (
                                          <span
                                            key={faculty._id}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                          >
                                            {faculty.name}
                                          </span>
                                        )
                                    )}
                                  </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
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
