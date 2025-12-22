"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

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

interface PlacementStats {
  _id: string;
  academicYear: string;
  category: "B.Tech" | "M.Tech";
  registeredCount: number;
  totalOffers: number;
  highestSalary: number;
  averageSalary: number;
  lowestSalary: number;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlacementsPage() {
  const [stats, setStats] = useState<PlacementStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [categories] = useState<("B.Tech" | "M.Tech")[]>(["B.Tech", "M.Tech"]);
  // const [selectedCategory, setSelectedCategory] = useState<
  //   "B.Tech" | "M.Tech" | null
  // >(null);
  const [currentPage, setCurrentPage] = useState(1);
  // const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const url = `/api/public/placement-statistics?page=${currentPage}&limit=${pagination.limit}`;

        // if (selectedCategory) {
        //   url += `&category=${selectedCategory}`;
        // }

        // if (searchTerm) {
        //   url += `&query=${encodeURIComponent(searchTerm)}`;
        // }

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setStats(data.data);
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch placement statistics");
        }
      } catch (err) {
        setError("Error fetching placement statistics");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [currentPage,  pagination.limit]);

  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  //   setCurrentPage(1);
  // };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-24">
        {/* Background pattern */}
        {/* <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div> */}
        <div className="absolute inset-0">
        <div className="relative w-full h-full">
  <Image
    src="/assets/images/Recruiters.png"
    alt="Placements Background"
    fill
    style={{ objectFit: "fill" }}
    priority
    className="opacity-20"
  />
</div>
          <div className="absolute inset-0"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Placement Statistics
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Track our students&apos; placement achievements and success
              stories
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar - Filters */}
          {/* <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by year or program..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
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

            
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Program
                </h3>
                <div className="space-y-2">
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
                    />
                    <span className="text-sm text-gray-700">All Programs</span>
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
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {/* Right Content - Statistics List */}
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
            ) : stats.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                No placement statistics found
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {stats.map((stat) => (
                  <motion.div
                    key={stat._id}
                    variants={fadeIn}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <AcademicCapIcon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-bold text-gray-800">
                          {stat.academicYear}
                        </h3>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {stat.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Registered Students */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <UserGroupIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            Registered Students
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.registeredCount}
                        </p>
                      </div>

                      {/* Total Offers */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ChartBarIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            Total Offers
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stat.totalOffers}
                        </p>
                      </div>

                      {/* Salary Statistics */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <ChartBarIcon className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-500">
                            Salary Statistics (LPA)
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Highest:</span>{" "}
                            {stat.highestSalary}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Average:</span>{" "}
                            {stat.averageSalary}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Lowest:</span>{" "}
                            {stat.lowestSalary}
                          </p>
                        </div>
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
