"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Student {
  _id: string;
  category: string;
  year: string;
  name: string;
  rollNumber: string;
}

interface StudentStats {
  total: number;
  totalBTech: number;
  totalMTech: number;
}

export default function StudentsPage() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("B.Tech");
  const [activeYear, setActiveYear] = useState<string>("I");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [stats, setStats] = useState<StudentStats>({
    total: 0,
    totalBTech: 0,
    totalMTech: 0,
  });

  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

        const response = await fetch(
          `${baseUrl}/api/public/student-information?page=${currentPage}&limit=70&category=${activeCategory}&year=${activeYear}`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch students information");
        }

        const data = await response.json();
        if (data.success) {
          setStudentsData(data.data);
          setTotalPages(data.pagination.pages);
          setHasNextPage(data.pagination.hasNextPage);
          setHasPrevPage(data.pagination.hasPrevPage);
          setStats({
            total: data.stats.total,
            totalBTech: data.stats.totalBTech,
            totalMTech: data.stats.totalMTech,
          });
        }
      } catch (error) {
        console.error("Error fetching students data:", error);
        setError("Failed to load students information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentsData();
  }, [currentPage, activeCategory, activeYear]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-800 text-white py-24">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Students</h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Our talented students in Computer Science & Engineering
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section with Total Counts */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {(stats.total = stats.totalBTech + stats.totalMTech)}
            </div>
            <div className="text-gray-600">Total Students</div>
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
            <div className="text-gray-600">B.Tech Students</div>
            <div className="text-sm text-gray-500 mt-1">All Years</div>
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
            <div className="text-gray-600">M.Tech Students</div>
            <div className="text-sm text-gray-500 mt-1">All Years</div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-col items-center space-y-6 mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setActiveCategory("B.Tech");
                setActiveYear("I");
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
                setActiveYear("I");
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
          </div>

          {/* Year Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {activeCategory === "B.Tech" ? (
              <>
                {["I", "II", "III", "IV"].map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setActiveYear(year);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-full transition-all ${
                      activeYear === year
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {year} Year
                  </button>
                ))}
              </>
            ) : (
              <>
                {["I", "II"].map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      setActiveYear(year);
                      setCurrentPage(1);
                    }}
                    className={`px-6 py-2 rounded-full transition-all ${
                      activeYear === year
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {year} Year
                  </button>
                ))}
              </>
            )}
          </div>
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

        {/* Students Grid */}
        {!isLoading && !error && studentsData.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {studentsData.map((student) => (
                <motion.div
                  key={student._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {student.name}
                  </div>
                  <div className="text-indigo-600 font-medium">
                    {student.rollNumber}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
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
                        onClick={() => paginate(page)}
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
                  onClick={() => paginate(currentPage + 1)}
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
        {!isLoading && !error && studentsData.length === 0 && (
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
              <p className="text-gray-600 mb-2">No students found</p>
              <p className="text-gray-500 text-sm">
                Please try another category or year
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
