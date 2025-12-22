"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface Faculty {
  _id: string;
  category: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  imageUrl: string;
  profileUrl: string;
  office: string;
  researchInterests: string;
  education: string;
  isActive: boolean;
  order: number;
  published: boolean;
}

interface FacultyStats {
  totalCount: number;
  professorCount: number;
  associateProfessorCount: number;
  assistantProfessorCount: number;
  adjunctCount: number;
  guestCount: number;
}

export default function FacultyPage() {
  const [facultyData, setFacultyData] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const [stats, setStats] = useState<FacultyStats>({
    totalCount: 0,
    professorCount: 0,
    associateProfessorCount: 0,
    assistantProfessorCount: 0,
    adjunctCount: 0,
    guestCount: 0,
  });

  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

        // Fetch all faculty data without category filter
        const response = await fetch(
          `${baseUrl}/api/public/faculty-information?page=${currentPage}&limit=50`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch faculty information");
        }

        const data = await response.json();
        if (data.data) {
          setFacultyData(data.data);
          setTotalPages(data.pagination.pages);
          setHasNextPage(data.pagination.hasNextPage);
          setHasPrevPage(data.pagination.hasPrevPage);

          // Calculate stats for Regular faculty only
          const regularFaculty = data.data.filter(
            (f: Faculty) => f.category === "Regular"
          );
          const stats = {
            totalCount: regularFaculty.length,
            professorCount: regularFaculty.filter(
              (f: Faculty) => f.designation === "Professor"
            ).length,
            associateProfessorCount: regularFaculty.filter(
              (f: Faculty) => f.designation === "Associate Professor"
            ).length,
            assistantProfessorCount: regularFaculty.filter(
              (f: Faculty) => f.designation === "Assistant Professor"
            ).length,
            adjunctCount: data.data.filter(
              (f: Faculty) => f.category === "Adjunct"
            ).length,
            guestCount: data.data.filter((f: Faculty) => f.category === "Guest")
              .length,
          };
          setStats(stats);
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        setError("Failed to load faculty information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyData();
  }, [currentPage, itemsPerPage]);

  // Filter faculty based on active category
  const filteredFaculty = useMemo(() => {
    if (activeCategory === "all") {
      return facultyData;
    }
    return facultyData.filter((faculty) => faculty.category === activeCategory);
  }, [facultyData, activeCategory]);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
              Faculty Members
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Meet our distinguished faculty members who are shaping the future
              of Computer Science & Engineering
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Regular Faculty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {stats.totalCount}
            </div>
            <div className="text-gray-600">Regular Faculty</div>
          </motion.div>

          {/* Professors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.professorCount}
            </div>
            <div className="text-gray-600">Professors</div>
          </motion.div>

          {/* Associate Professors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.associateProfessorCount}
            </div>
            <div className="text-gray-600">Associate Professors</div>
          </motion.div>

          {/* Assistant Professors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.assistantProfessorCount}
            </div>
            <div className="text-gray-600">Assistant Professors</div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12">
          <button
            onClick={() => {
              setActiveCategory("all");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Faculty
          </button>
          <button
            onClick={() => {
              setActiveCategory("Regular");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "Regular"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Regular Faculty
          </button>
          <button
            onClick={() => {
              setActiveCategory("Adjunct");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "Adjunct"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Adjunct Faculty
          </button>
          <button
            onClick={() => {
              setActiveCategory("Guest");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "Guest"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Guest Faculty
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

        {/* Empty State */}
        {!isLoading && !error && filteredFaculty.length === 0 && (
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
              <p className="text-gray-600 mb-2">
                No faculty members found in this category
              </p>
              <p className="text-gray-500 text-sm">
                Please try another category or check back later.
              </p>
            </div>
          </div>
        )}

        {/* Faculty Grid */}
        {!isLoading && filteredFaculty.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredFaculty.map((faculty) => (
                <motion.div
                  key={faculty._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="relative h-64 bg-gray-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <Image
                          src={
                            faculty.imageUrl ||
                            "/assets/images/default-profile.png"
                          }
                          alt={faculty.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/assets/images/default-profile.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          faculty.category === "Regular"
                            ? faculty.designation === "Professor"
                              ? "bg-purple-100 text-purple-800"
                              : faculty.designation === "Associate Professor"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                            : faculty.category === "Adjunct Faculty"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {faculty.category === "Regular"
                          ? faculty.designation
                          : `${faculty.category} Facutly`}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {faculty.category === "Regular" ? (
                        <Link
                          href={`/people/faculty/${faculty.profileUrl}`}
                          className="hover:text-indigo-600 transition-colors duration-200"
                        >
                          {faculty.name === "Dr. Sridhar Chimalakonda"
                            ? `${faculty.name} (HoD)`
                            : faculty.name}
                        </Link>
                      ) : faculty.name === "Dr. Sridhar Chimalakonda" ? (
                        `${faculty.name} (HoD)`
                      ) : (
                        faculty.name
                      )}
                    </h3>

                    {/* Faculty Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {faculty.email && (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{faculty.email}</span>
                        </div>
                      )}

                      {faculty.phone && (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>{faculty.phone}</span>
                        </div>
                      )}

                      {faculty.office && (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span>{faculty.office}</span>
                        </div>
                      )}

                      {/* Research Interests */}
                      {faculty.researchInterests && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Research Interests:
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {faculty.researchInterests}
                          </p>
                        </div>
                      )}
                      {/* Show "View Profile" only for Regular faculty */}
                      {faculty.category === "Regular" && (
                        <div className="flex justify-end">
                          <Link
                            href={`/people/faculty/${faculty.profileUrl}`}
                            className="flex items-center px-2 rounded text-white bg-indigo-600 hover:text-yellow-400 group transition-colors duration-200"
                          >
                            View Profile
                            <svg
                              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
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
      </div>
    </div>
  );
}
