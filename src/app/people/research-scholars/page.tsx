"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface Faculty {
  name: string;
  institute?: string;
  _id: string;
}

interface ResearchScholar {
  _id: string;
  category: string;
  name: string;
  imageUrl: string;
  year: string;
  batch: string;
  facultyInvolved: Faculty[];
  domain: string;
  email: string;
  isActive: boolean;
  order: number;
  published: boolean;
}

interface ScholarStats {
  totalCount: number;
  phdRegularCount: number;
  phdExternalCount: number;
  msRegularCount: number;
}

export default function ResearchScholarsPage() {
  const [allScholarsData, setAllScholarsData] = useState<ResearchScholar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const [stats, setStats] = useState<ScholarStats>({
    totalCount: 0,
    phdRegularCount: 0,
    phdExternalCount: 0,
    msRegularCount: 0,
  });

  useEffect(() => {
    const fetchAllScholarsData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(
          `${baseUrl}/api/public/scholar-information?limit=1000`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch all scholars data");
        }

        const data = await response.json();
        if (data.data) {
          // Sort by year, batch, and email in descending order
          const sortedData = data.data.sort(
            (a: ResearchScholar, b: ResearchScholar) => {
              // First compare by year (descending)
              if (a.year !== b.year) {
                return parseInt(b.year) - parseInt(a.year);
              }
              // If years are equal, compare by batch (descending)
              if (a.batch !== b.batch) {
                return b.batch.localeCompare(a.batch);
              }
              // If batches are equal, compare by email (ascending)
              return a.email.localeCompare(b.email);
            }
          );

          setAllScholarsData(sortedData);

          const stats = {
            totalCount: data.pagination.total,
            phdRegularCount: data.data.filter(
              (s: ResearchScholar) => s.category === "PhD Regular"
            ).length,
            phdExternalCount: data.data.filter(
              (s: ResearchScholar) => s.category === "PhD External"
            ).length,
            msRegularCount: data.data.filter(
              (s: ResearchScholar) => s.category === "MS Regular"
            ).length,
          };
          setStats(stats);
        }
      } catch (error) {
        console.error("Error fetching all scholars data:", error);
        setError("Failed to fetch scholars data. Please try again later.");
      }
    };

    fetchAllScholarsData();
  }, []);

  // Filter and paginate scholars based on active category
  const filteredScholars = useMemo(() => {
    const filtered = allScholarsData.filter(
      (scholar) =>
        activeCategory === "all" || scholar.category === activeCategory
    );

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [allScholarsData, activeCategory, currentPage, itemsPerPage]);

  // Get total count for pagination
  const totalFilteredCount = useMemo(() => {
    return allScholarsData.filter(
      (scholar) =>
        activeCategory === "all" || scholar.category === activeCategory
    ).length;
  }, [allScholarsData, activeCategory]);

  // Calculate total pages
  const totalPages = Math.ceil(totalFilteredCount / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  // const pageNumbers = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   pageNumbers.push(i);
  // }
  // Generate page numbers for pagination
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  // Show limited page numbers with ellipsis
  const getDisplayedPageNumbers = () => {
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) return pageNumbers;

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  useEffect(() => {
    // Set loading to false once we have data
    if (allScholarsData.length > 0) {
      setIsLoading(false);
    }
  }, [allScholarsData]);

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
              Research Scholars
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Meet our dedicated research scholars working on cutting-edge
              research in Computer Science & Engineering
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Scholars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {stats.totalCount}
            </div>
            <div className="text-gray-600">Total Scholars</div>
          </motion.div>

          {/* PhD Regular */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.phdRegularCount}
            </div>
            <div className="text-gray-600">PhD Regular</div>
          </motion.div>

          {/* PhD External */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {stats.phdExternalCount}
            </div>
            <div className="text-gray-600">PhD External</div>
          </motion.div>

          {/* MS Regular */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.msRegularCount}
            </div>
            <div className="text-gray-600">MS Regular</div>
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
            All Scholars
          </button>
          <button
            onClick={() => {
              setActiveCategory("PhD Regular");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "PhD Regular"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            PhD Regular
          </button>
          <button
            onClick={() => {
              setActiveCategory("PhD External");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "PhD External"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            PhD External
          </button>
          <button
            onClick={() => {
              setActiveCategory("MS Regular");
              setCurrentPage(1);
            }}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "MS Regular"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            MS Regular
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
        {!isLoading && !error && filteredScholars.length === 0 && (
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
                No research scholars found in this category
              </p>
              <p className="text-gray-500 text-sm">
                Please try another category or check back later.
              </p>
            </div>
          </div>
        )}

        {/* Scholars Grid */}
        {!isLoading && filteredScholars.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
            >
              {filteredScholars.map((scholar) => (
                <motion.div
                  key={scholar._id}
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
                            scholar.imageUrl ||
                            "/assets/images/default-profile.png"
                          }
                          alt={scholar.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/images/default-profile.png";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          scholar.category === "PhD Regular"
                            ? "bg-purple-100 text-purple-800"
                            : scholar.category === "PhD External"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {scholar.category}
                      </span>
                      {scholar.year && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {scholar.batch} {scholar.year}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {scholar.name}
                    </h3>
                    {scholar.facultyInvolved?.length > 0 && (
                      <p className="mb-3 text-black">
                        Guide :{" "}
                        {scholar.facultyInvolved.map((faculty, index) => (
                          <span
                            key={index}
                            className="text-indigo-600 font-medium"
                          >
                            <Link
                              key={faculty._id}
                              href={`/people/faculty/${faculty.institute}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                            >
                              {faculty.name}
                            </Link>
                            {index < scholar.facultyInvolved.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </p>
                    )}

                    {/* Scholar Details */}
                    <div className="space-y-2 text-sm text-gray-600">
                      {scholar.email && (
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
                          <span>{scholar.email}</span>
                        </div>
                      )}

                      {/* Research Area */}
                      {scholar.domain && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-800 mb-2">
                            Research Area:
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {scholar.domain}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  {/* Previous button */}
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {getDisplayedPageNumbers().map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === number
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  {/* Next button */}
                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
