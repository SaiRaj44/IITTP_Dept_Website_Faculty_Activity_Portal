"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpenIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  LinkIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePageMetadata } from "../../hooks/usePageMetadata";

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
  institute: string;
  _id: string;
}

interface Book {
  _id: string;
  category: "Monograph" | "Book";
  title: string;
  chapter: string;
  facultyInvolved: Faculty[];
  publisher: string;
  volume: string;
  pages: string;
  isbn?: string;
  year?: string;
  month?: string;
  imgURL?: string;
  url?: string;
  date: string;
  createdBy: string;
  published: boolean;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["Monograph", "Book"]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  // Use the metadata hook
  usePageMetadata({
    title: "Books & Monographs - Computer Science & Engineering, IIT Tirupati",
    description:
      "Discover books and monographs authored by faculty members of the Department of Computer Science & Engineering at IIT Tirupati.",
    keywords: [
      "Books",
      "Monographs",
      "CSE IIT Tirupati",
      "Faculty Publications",
      "Research Publications",
    ],
    ogTitle:
      "Books & Monographs - Computer Science & Engineering, IIT Tirupati",
    ogDescription:
      "Discover books and monographs authored by faculty members of the Department of Computer Science & Engineering at IIT Tirupati.",
    ogImage: "/assets/images/research-areas-og.png",
    ogUrl: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://cse.iittp.ac.in"
    }/research/areas`,
  });

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let url = `/api/public/books?page=${currentPage}&limit=${pagination.limit}`;

        // Add category filter
        if (selectedCategory) {
          url += `&category=${selectedCategory}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
          setBooks(data.data);
          setCategories(data.filters?.category || []);
          setPagination(data.pagination);
        } else {
          setError("Failed to fetch books");
        }
      } catch (err) {
        setError("Error fetching books");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, selectedCategory, pagination.limit]);

  // Handle page change
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
              Books & Monographs
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-indigo-100">
              Books and monographs authored by our faculty members
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
              {/* Categories Filter - using radio buttons */}
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

            {/* Books Grid */}
            {!loading && !error && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {books.length > 0 ? (
                  books.map((book) => (
                    <motion.div
                      key={book._id}
                      variants={fadeIn}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      {/* Book Cover Image */}
                      <div className="relative h-48 md:h-60 bg-gray-200">
                        {book.imgURL ? (
                          <Image
                            src={book.imgURL}
                            alt={book.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="w-full h-full"
                            unoptimized={true}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100">
                            <BookOpenIcon className="h-16 w-16 text-blue-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {book.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 md:p-5 flex-grow flex flex-col">
                        <h2
                          className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-2"
                          title={book.title}
                        >
                          {book.title}
                        </h2>

                        {/* Chapter info if available */}
                        {book.chapter && (
                          <p className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Chapter:</span>{" "}
                            {book.chapter}
                          </p>
                        )}

                        {/* Faculty */}
                        <div className="flex items-start space-x-2 mb-2">
                          <UserGroupIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Authors
                            </h3>
                            <ul className="text-sm text-gray-600">
                              {book.facultyInvolved.map((faculty, index) => (
                                <li key={index}>
                                  {faculty.institute ? (
                                    <Link
                                      key={faculty._id}
                                      href={`/people/faculty/${faculty.institute}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-2.5 py-0.5  rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                                    >
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

                        {/* Publisher */}
                        <div className="flex items-start space-x-2 mb-2">
                          <BuildingLibraryIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Publisher
                            </h3>
                            <p className="text-sm text-gray-600">
                              {book.publisher}
                            </p>
                          </div>
                        </div>

                        {/* Publication Details */}
                        <div className="flex items-start space-x-2 mb-2">
                          <CalendarIcon className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-700">
                              Published
                            </h3>
                            <p className="text-sm text-gray-600">
                              {book.month && `${book.month} `}
                              {book.year}
                              {book.volume && `, Volume ${book.volume}`}
                              {book.pages && `, Pages ${book.pages}`}
                            </p>
                          </div>
                        </div>

                        {/* ISBN if available */}
                        {book.isbn && (
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">ISBN:</span>{" "}
                            {book.isbn}
                          </div>
                        )}

                        {/* URL Link if available */}
                        {book.url && (
                          <div className="mt-auto pt-3">
                            <a
                              href={book.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              <LinkIcon className="h-4 w-4 mr-1" />
                              View Details
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <div className="bg-blue-50 rounded-lg p-8 max-w-lg mx-auto">
                      <BookOpenIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No books found
                      </h3>
                      <p className="text-gray-600">
                        No books match your current search criteria. Try
                        adjusting your filters or search term.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && !error && books.length > 0 && pagination.pages > 1 && (
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
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
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
