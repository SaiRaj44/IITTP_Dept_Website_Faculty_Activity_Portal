"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Graduand {
  _id: string;
  category: string;
  batch: string;
  name: string;
  rollNumber: string;
  achievements?: string[];
  imageUrl?: string;
}

interface GraduandStats {
  total: number;
  totalBTech: number;
  totalMTech: number;
  totalPhD: number;
  totalMS: number;
}

export default function GraduandsPage() {
  const [graduandsData, setGraduandsData] = useState<Graduand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("B.Tech");
  // const [activeYear, setActiveYear] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [stats, setStats] = useState<GraduandStats>({
    total: 0,
    totalBTech: 0,
    totalMTech: 0,
    totalPhD: 0,
    totalMS: 0,
  });

  useEffect(() => {
    const fetchGraduandsData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

        // First fetch all stats
        const statsResponse = await fetch(
          `${baseUrl}/api/public/graduand-information?limit=1000`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!statsResponse.ok) {
          throw new Error("Failed to fetch graduands statistics");
        }

        const statsData = await statsResponse.json();
        if (statsData.success) {
          // Calculate stats from all data
          const allGraduands = statsData.data;
          const stats = {
            total: allGraduands.length,
            totalBTech: allGraduands.filter(
              (g: Graduand) => g.category === "B.Tech"
            ).length,
            totalMTech: allGraduands.filter(
              (g: Graduand) => g.category === "M.Tech"
            ).length,
            totalPhD: allGraduands.filter(
              (g: Graduand) => g.category === "Ph.D"
            ).length,
            totalMS: allGraduands.filter(
              (g: Graduand) => g.category === "M.S.(R)"
            ).length,
          };
          setStats(stats);
        }

        // Then fetch paginated data for display
        const response = await fetch(
          `${baseUrl}/api/public/graduand-information?page=${currentPage}&limit=30&category=${activeCategory}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch graduands information");
        }

        const data = await response.json();
        if (data.success) {
          setGraduandsData(data.data);
          setTotalPages(data.pagination.pages);
          setHasNextPage(data.pagination.hasNextPage);
          setHasPrevPage(data.pagination.hasPrevPage);
        }
      } catch (error) {
        console.error("Error fetching graduands data:", error);
        setError("Failed to load graduands information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraduandsData();
  }, [currentPage, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white py-24">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Graduands</h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Celebrating our graduating students in Computer Science &
              Engineering
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {stats.total}
            </div>
            <div className="text-gray-600">Total Graduands</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.totalBTech}
            </div>
            <div className="text-gray-600">B.Tech Graduands</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalMTech}
            </div>
            <div className="text-gray-600">M.Tech Graduands</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalPhD}
            </div>
            <div className="text-gray-600">Ph.D Graduands</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.totalMS}
            </div>
            <div className="text-gray-600">M.S.(R) Graduands</div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category and Year Filters */}
        <div className="flex flex-wrap justify-center mb-12 space-x-4">
          <button
            onClick={() => {
              setActiveCategory("B.Tech");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === "B.Tech"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            B.Tech
          </button>
          <button
            onClick={() => {
              setActiveCategory("M.Tech");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === "M.Tech"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            M.Tech
          </button>
          <button
            onClick={() => {
              setActiveCategory("Ph.D");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === "Ph.D"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Ph.D
          </button>
          <button
            onClick={() => {
              setActiveCategory("M.S.(R)");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full transition-all ${
              activeCategory === "M.S.(R)"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            M.S.(R)
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative max-w-2xl mx-auto">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {/* Graduands Grid */}
        {!isLoading && !error && graduandsData.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {graduandsData.map((graduand) => (
                <motion.div
                  key={graduand._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ${
                    graduand.category === "Ph.D" ? "flex" : ""
                  }`}
                >
                  {graduand.category === "Ph.D" && (
                    <div className="relative w-1/3 bg-gray-200 rounded-l-lg">
                      <Image
                        src={
                          graduand.imageUrl ||
                          "/assets/images/default-profile.png"
                        }
                        alt={graduand.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <div
                    className={`p-6 ${
                      graduand.category === "Ph.D" ? "w-2/3" : ""
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          graduand.category === "B.Tech"
                            ? "bg-blue-100 text-blue-800"
                            : graduand.category === "M.Tech"
                            ? "bg-green-100 text-green-800"
                            : graduand.category === "Ph.D"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {graduand.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {graduand.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-2">
                      {graduand.rollNumber}
                    </p>
                    {graduand.achievements &&
                      graduand.achievements.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-600 mb-2">
                            Achievements
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {graduand.achievements.map((achievement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!hasPrevPage}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    hasPrevPage
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!hasNextPage}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    hasNextPage
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && graduandsData.length === 0 && (
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
              <p className="text-gray-600 mb-2">No graduands found</p>
              <p className="text-gray-500 text-sm">
                Please try another category or check back later
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
