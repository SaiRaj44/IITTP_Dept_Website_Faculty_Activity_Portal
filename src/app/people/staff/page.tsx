"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { StaffInformation } from "@/app/types/staff-information";

export default function StaffPage() {
  const [staffData, setStaffData] = useState<StaffInformation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchStaffData = async () => {
      // Prevent multiple fetches
      if (hasFetched) return;

      try {
        setIsLoading(true);
        setError("");

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const response = await fetch(
          `${baseUrl}/api/public/staff-information`,
          {
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Validate the response data
        if (!data || !Array.isArray(data.data)) {
          throw new Error("Invalid data format received from server");
        }

        // Set the data and mark as fetched
        setStaffData(data.data);
        setHasFetched(true);
      } catch (error) {
        console.error("Error fetching staff data:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load staff information"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, [hasFetched]); // Only re-run if hasFetched changes

  // Filter staff based on active category
  const filteredStaff = useMemo(() => {
    return activeCategory === "all"
      ? staffData
      : staffData.filter((staff) => staff.category === activeCategory);
  }, [staffData, activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-800 text-white py-20">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Staff</h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              Meet the dedicated staff members who support the Department of
              Computer Science & Engineering
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center mb-12">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Staff
          </button>
          <button
            onClick={() => setActiveCategory("Technical")}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "Technical"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Technical Staff
          </button>
          <button
            onClick={() => setActiveCategory("Non Technical")}
            className={`px-6 py-2 mx-2 mb-2 rounded-full transition-all ${
              activeCategory === "Non Technical"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Non-Technical Staff
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
        {!isLoading && !error && filteredStaff.length === 0 && (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              <p className="text-gray-600 mb-2">No staff members found</p>
              <p className="text-gray-500 text-sm">
                No staff information is available at this time.
              </p>
            </div>
          </div>
        )}

        {/* Staff Grid */}
        {!isLoading && !error && filteredStaff.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {filteredStaff.map((staff) => (
              <motion.div
                key={staff._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className="relative h-64 bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg transform hover:scale-110 transition-transform duration-300">
                      <Image
                        src={staff.imageUrl}
                        alt={staff.name}
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
                        staff.category === "Technical"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {staff.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {staff.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {staff.designation}
                  </p>

                  {/* Contact and Details */}
                  <div className="space-y-2 text-sm text-gray-600">
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
                      <a
                        href={`mailto:${staff.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {staff.email}
                      </a>
                    </div>

                    {staff.office && (
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
                        <span>{staff.office}</span>
                      </div>
                    )}

                    {staff.areas && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Areas:
                        </h4>
                        <p className="text-gray-600 text-sm">{staff.areas}</p>
                      </div>
                    )}

                    {staff.PhD && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Education:
                        </h4>
                        <p className="text-gray-600 text-sm">{staff.PhD}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
