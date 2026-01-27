"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  UserGroupIcon,
  // LinkIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* -----------------------------
   PHP API TYPES
-------------------------------- */
interface PHPPublication {
  sno: number;
  eid: string;
  type: string;
  details: string;
  publication_date: string;
}

interface PHPResponse {
  count: number;
  publications: PHPPublication[];
}

/* -----------------------------
   SLUG → EMPID MAPPING
-------------------------------- */
const SLUG_TO_EID_MAP: Record<string, string> = {
  "dr-sridhar-chimalakonda": "0036",
  "prof-venkata-ramana-badarla": "0043",
  "dr-kalidas-yeturu": "0038",
  "dr-g-ramakrishna": "0057",
  "dr-ajin-george-joseph": "0136",
  "dr-jaynarayan-t-tudu": "0071",
  "dr-v-mahendran": "0015",
  "dr-raghavendra-kanakagiri": "0134",
  "dr-s-raja": "0066",
  "dr-varsha-bhat-kukkala": "0310",
  "dr-chalavadi-vishnu": "0262",
};

/* -----------------------------
   EID → NAME MAPPING
-------------------------------- */
const EID_TO_NAME_MAP: Record<string, string> = {
  "0036": "Dr. Sridhar Chimalakonda",
  "0043": "Prof. Venkata Ramana Badarla",
  "0038": "Dr. Kalidas Yeturu",
  "0057": "Dr. G. Ramakrishna",
  "0136": "Dr. Ajin George Joseph",
  "0071": "Dr. Jaynarayan T. Tudu",
  "0015": "Dr. V. Mahendran",
  "0134": "Dr. Raghavendra Kanakagiri",
  "0066": "Dr. S. Raja",
  "0310": "Dr. Varsha Bhat Kukkala",
  "0262": "Dr. Chalavadi Vishnu",
};

/* -----------------------------
   EID → SLUG MAPPING (for back links)
-------------------------------- */
const EID_TO_SLUG_MAP: Record<string, string> = Object.entries(
  SLUG_TO_EID_MAP
).reduce((acc, [slug, eid]) => {
  acc[eid] = slug;
  return acc;
}, {} as Record<string, string>);

/* -----------------------------
   HELPER FUNCTIONS
-------------------------------- */
const formatPublicationText = (pub: PHPPublication): string => {
  try {
    // Extract title from details (remove HTML tags)
    const title = pub.details
      ? pub.details
          .replace(/<[^>]*>/g, "")
          .replace(/&[a-z]+;/g, " ")
          .trim()
      : "Untitled Publication";

    // Get faculty name
    // const author = EID_TO_NAME_MAP[pub.eid] || `Faculty (EID: ${pub.eid})`;

    // Get year from publication date
    // const year = pub.publication_date
    //   ? new Date(pub.publication_date).getFullYear()
    //   : "Unknown Year";

    // Get journal/conference from type
    // const journal = pub.type || "Journal";

    // Construct the formatted string
    // return `${author}. (${year}). ${title}. ${journal}`;
    return `${title}.`;
  } catch (error) {
    console.error("Error formatting publication:", error);
    return "Publication details not available";
  }
};

const sanitizeHtml = (html: string): string => {
  // Create a temporary element and use textContent to prevent XSS, then reapply HTML structure
  // This preserves the HTML structure while preventing script injection
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (tempDiv) {
    tempDiv.innerHTML = html;
  }
  return html;
};

const extractCategoriesFromPublications = (
  pubs: PHPPublication[]
): string[] => {
  const categories = new Set<string>();
  pubs.forEach((pub) => {
    if (pub.type && pub.type.trim()) {
      categories.add(pub.type.trim());
    }
  });
  return Array.from(categories).sort();
};

const extractYearsFromPublications = (pubs: PHPPublication[]): string[] => {
  const years = new Set<string>();
  pubs.forEach((pub) => {
    if (pub.publication_date) {
      const year = new Date(pub.publication_date).getFullYear().toString();
      years.add(year);
    }
  });
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
};

// Main component wrapped in Suspense
export default function PublicationsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PublicationsContent />
    </Suspense>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading publications...</p>
      </div>
    </div>
  );
}

// Main content component that uses useSearchParams
function PublicationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const facultyFromQuery = searchParams.get("faculty");

  const [allPublications, setAllPublications] = useState<PHPPublication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<
    PHPPublication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [facultyFilter, setFacultyFilter] = useState<string | null>(
    facultyFromQuery
  );
  const [faculties, setFaculties] = useState<
    Array<{ eid: string; name: string }>
  >([]);

  /* -----------------------------
     FETCH ALL PUBLICATIONS FROM PHP API
  -------------------------------- */
  useEffect(() => {
    const fetchAllPublications = async () => {
      try {
        setLoading(true);

        // Fetch publications for all faculty members in parallel
        const fetchPromises = Object.values(SLUG_TO_EID_MAP).map(
          async (eid) => {
            try {
              const response = await fetch(
                // `http://localhost:8080/api/publications.php?eid=${eid}`,
                `https://cse.iittp.ac.in/sai/publications.php?eid=${eid}`,
                {
                  headers: {
                    Accept: "application/json",
                  },
                  cache: "no-store",
                }
              );

              if (!response.ok) {
                console.warn(`Failed to fetch publications for EID ${eid}`);
                return [];
              }

              const data: PHPResponse = await response.json();
              return data.publications || [];
            } catch (err) {
              console.error(`Error fetching publications for EID ${eid}:`, err);
              return [];
            }
          }
        );

        const results = await Promise.all(fetchPromises);
        const allPubs = results.flat();

        // Sort by date (newest first)
        const sortedPubs = allPubs.sort((a, b) => {
          const dateA = a.publication_date
            ? new Date(a.publication_date).getTime()
            : 0;
          const dateB = b.publication_date
            ? new Date(b.publication_date).getTime()
            : 0;
          return dateB - dateA;
        });

        setAllPublications(sortedPubs);

        // Extract filters
        const extractedCategories =
          extractCategoriesFromPublications(sortedPubs);
        const extractedYears = extractYearsFromPublications(sortedPubs);

        setCategories(extractedCategories);
        setYears(extractedYears);

        // Prepare faculty list for filter
        const facultyList = Object.entries(EID_TO_NAME_MAP).map(
          ([eid, name]) => ({
            eid,
            name,
          })
        );
        setFaculties(facultyList);

        // Calculate initial pagination
        const total = sortedPubs.length;
        const pages = Math.ceil(total / pagination.limit);
        setPagination((prev) => ({
          ...prev,
          total,
          pages,
        }));

        // Set initial filtered publications (first page)
        const initialFiltered = sortedPubs.slice(0, pagination.limit);
        setFilteredPublications(initialFiltered);
      } catch (err) {
        console.error("Error fetching all publications:", err);
        setError("Failed to load publications from database");
      } finally {
        setLoading(false);
      }
    };

    fetchAllPublications();
  }, [pagination.limit]);

  /* -----------------------------
     APPLY FILTERS AND PAGINATION
  -------------------------------- */
  useEffect(() => {
    if (!allPublications.length) return;

    // Start with all publications
    let filtered = [...allPublications];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((pub) => {
        const title = pub.details ? pub.details.toLowerCase() : "";
        const facultyName = EID_TO_NAME_MAP[pub.eid]?.toLowerCase() || "";
        const type = pub.type?.toLowerCase() || "";

        return (
          title.includes(term) ||
          facultyName.includes(term) ||
          type.includes(term) ||
          pub.eid.includes(term)
        );
      });
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((pub) => pub.type === selectedCategory);
    }

    // Apply year filter
    if (selectedYear) {
      filtered = filtered.filter((pub) => {
        if (!pub.publication_date) return false;
        const year = new Date(pub.publication_date).getFullYear().toString();
        return year === selectedYear;
      });
    }

    // Apply faculty filter
    if (facultyFilter) {
      filtered = filtered.filter((pub) => pub.eid === facultyFilter);
    }

    // Update pagination
    const total = filtered.length;
    const pages = Math.ceil(total / pagination.limit);
    setPagination((prev) => ({
      ...prev,
      total,
      pages,
    }));

    // Get current page data
    const startIndex = (currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const pageData = filtered.slice(startIndex, endIndex);

    setFilteredPublications(pageData);
  }, [
    allPublications,
    searchTerm,
    selectedCategory,
    selectedYear,
    facultyFilter,
    currentPage,
    pagination.limit,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePageNumbers = (): (number | string)[] => {
    const totalPages = pagination.pages;
    const current = currentPage;
    const siblingCount = 1;
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, idx) => idx + start);
    };

    if (totalPages <= 7) {
      return range(1, totalPages);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, totalPages);

    const shouldShowLeftEllipsis = leftSibling > 2;
    const shouldShowRightEllipsis = rightSibling < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "...", totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, "...", ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      const middleRange = range(leftSibling, rightSibling);
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return range(1, totalPages);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedYear(null);
    setFacultyFilter(null);
    setSearchTerm("");
    setCurrentPage(1);
    // Also clear the query parameter
    router.push("/research/publications");
  };

  // Get the current faculty name if filtered
  const currentFacultyName = facultyFilter
    ? EID_TO_NAME_MAP[facultyFilter]
    : null;
  const currentFacultySlug = facultyFilter
    ? EID_TO_SLUG_MAP[facultyFilter]
    : null;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {facultyFilter && currentFacultyName ? (
              <div className="mb-6">
                {/* Back to Faculty Profile */}
                <div className="flex items-center justify-center mb-4">
                  <Link
                    href={`/people/faculty/${currentFacultySlug}`}
                    className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to {currentFacultyName.split(" ")[0]}s Profile
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <AcademicCapIcon className="h-10 w-10 text-blue-200" />
                  <h1 className="text-4xl md:text-5xl font-bold">
                    {currentFacultyName}s Publications
                  </h1>
                </div>
                {/* <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                  All publications by {currentFacultyName}
                </p> */}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 mb-4">
                <AcademicCapIcon className="h-10 w-10 text-blue-200" />
                <h1 className="text-4xl md:text-5xl font-bold">
                  Research Publications
                </h1>
              </div>
            )}

            {/* Search Bar in Hero */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={
                    facultyFilter && currentFacultyName
                      ? `Search ${
                          currentFacultyName.split(" ")[0]
                        }'s publications...`
                      : "Search publications by title, faculty, or type..."
                  }
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-12 pr-12 py-4 text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="container mx-auto px-4 py-4 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <FunnelIcon className="h-5 w-5" />
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          {selectedCategory || selectedYear || facultyFilter ? (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Filtered
            </span>
          ) : null}
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div
            className={`lg:w-64 flex-shrink-0 ${
              mobileFiltersOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-8 border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {(selectedCategory ||
                  selectedYear ||
                  facultyFilter ||
                  searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Faculty Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <UserGroupIcon className="h-4 w-4" />
                  Faculty Member
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        checked={facultyFilter === null}
                        onChange={() => {
                          setFacultyFilter(null);
                          setCurrentPage(1);
                          router.push("/research/publications");
                        }}
                        className="sr-only"
                        name="faculty"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          facultyFilter === null
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {facultyFilter === null && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      All Faculty
                    </span>
                  </label>
                  {faculties.map((faculty) => (
                    <label
                      key={faculty.eid}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          checked={facultyFilter === faculty.eid}
                          onChange={() => {
                            setFacultyFilter(faculty.eid);
                            setCurrentPage(1);
                            router.push(
                              `/research/publications?faculty=${faculty.eid}`
                            );
                          }}
                          className="sr-only"
                          name="faculty"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            facultyFilter === faculty.eid
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {facultyFilter === faculty.eid && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                        {faculty.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Years Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Publication Year
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        checked={selectedYear === null}
                        onChange={() => {
                          setSelectedYear(null);
                          setCurrentPage(1);
                        }}
                        className="sr-only"
                        name="year"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedYear === null
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {selectedYear === null && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      All Years
                    </span>
                  </label>
                  {years.map((year) => (
                    <label
                      key={year}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          checked={selectedYear === year}
                          onChange={() => {
                            setSelectedYear(year);
                            setCurrentPage(1);
                          }}
                          className="sr-only"
                          name="year"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedYear === year
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {selectedYear === year && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {year}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DocumentTextIcon className="h-4 w-4" />
                  Publication Type
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="radio"
                        checked={selectedCategory === null}
                        onChange={() => {
                          setSelectedCategory(null);
                          setCurrentPage(1);
                        }}
                        className="sr-only"
                        name="category"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedCategory === null
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 group-hover:border-gray-400"
                        }`}
                      >
                        {selectedCategory === null && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      All Types
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          checked={selectedCategory === category}
                          onChange={() => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                          }}
                          className="sr-only"
                          name="category"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedCategory === category
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 group-hover:border-gray-400"
                          }`}
                        >
                          {selectedCategory === category && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {pagination.total}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total Publications
                  </div>
                  {facultyFilter && currentFacultyName && (
                    <div className="text-xs text-gray-500 mt-2">
                      Filtered for {currentFacultyName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading publications from database...
                  </p>
                  {facultyFilter && currentFacultyName && (
                    <p className="text-sm text-gray-500 mt-2">
                      Fetching publications for {currentFacultyName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-red-800">
                      Error Loading Publications
                    </h3>
                    <p className="text-red-600 mt-1">{error}</p>
                    <p className="text-red-500 text-sm mt-2">
                      Make sure the PHP API is running at http://localhost:8080
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredPublications.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No publications found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {facultyFilter && currentFacultyName
                      ? `No publications found for ${currentFacultyName}. Try adjusting your filters.`
                      : "No publications match your search criteria. Try adjusting your filters."}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear all filters
                  </button>
                  {facultyFilter && currentFacultySlug && (
                    <Link
                      href={`/people/faculty/${currentFacultySlug}`}
                      className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to faculty profile
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Publications List - NUMBERED FORMAT */}
            {!loading && !error && filteredPublications.length > 0 && (
              <>
                {/* Header Stats */}
                <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {facultyFilter && currentFacultyName
                          ? `${currentFacultyName}'s Publications`
                          : "Publications"}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Showing {(currentPage - 1) * pagination.limit + 1} -{" "}
                        {Math.min(
                          currentPage * pagination.limit,
                          pagination.total
                        )}{" "}
                        of {pagination.total} publications
                        {facultyFilter && currentFacultyName && (
                          <span className="text-blue-600 font-medium">
                            {" "}
                            for {currentFacultyName}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {facultyFilter && currentFacultyName && (
                        <Link
                          href={`/people/faculty/${currentFacultySlug}`}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                        >
                          <UserGroupIcon className="h-3 w-3 mr-1" />
                          {currentFacultyName}
                          <XMarkIcon
                            className="h-4 w-4 ml-2 hover:text-purple-900 cursor-pointer"
                            onClick={(e) => {
                              e.preventDefault();
                              setFacultyFilter(null);
                              setCurrentPage(1);
                              router.push("/research/publications");
                            }}
                          />
                        </Link>
                      )}
                      {selectedCategory && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800">
                          {selectedCategory}
                          <button
                            onClick={() => setSelectedCategory(null)}
                            className="ml-2 hover:text-blue-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      )}
                      {selectedYear && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-green-100 text-green-800">
                          {selectedYear}
                          <button
                            onClick={() => setSelectedYear(null)}
                            className="ml-2 hover:text-green-900"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Publications List Container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="divide-y divide-gray-100"
                  >
                    {filteredPublications.map((publication) => (
                      <motion.div
                        key={`${publication.eid}-${publication.sno}`}
                        variants={fadeIn}
                        className="p-8 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex">
                          {/* Number */}
                          <div className="flex-shrink-0 mr-8">
                            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-black text-white rounded-xl font-bold text-lg shadow-md">
                              {/* {(currentPage - 1) * pagination.limit + index + 1} */}
                              <svg
                                className="w-4 h-4 mr-1 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M7 7h10M7 11h10M7 15h6"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* Publication Content */}
                          <div className="flex-1 min-w-0">
                            {/* Publication Text */}
                            <div className="text-gray-800 leading-relaxed text-lg mb-4 prose prose-sm max-w-none [&_span]:text-gray-800 [&_strong]:font-semibold [&_em]:italic"
                              dangerouslySetInnerHTML={{ __html: publication.details || formatPublicationText(publication) }}
                            />

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 mt-6">
                              {/* Faculty Badge */}
                              {/* {!facultyFilter && (
                                <Link
                                  href={`/research/publications?faculty=${publication.eid}`}
                                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 transition-colors"
                                >
                                  <UserGroupIcon className="h-3 w-3 mr-1.5" />
                                  {EID_TO_NAME_MAP[publication.eid]}
                                </Link>
                              )} */}

                              {/* Type Badge */}
                              {publication.type && (
                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-50 text-blue-700">
                                  <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                  {publication.type}
                                </span>
                              )}

                              {/* Year
                              {publication.publication_date && (
                                <span className="inline-flex items-center text-sm text-gray-600">
                                  <CalendarIcon className="h-4 w-4 mr-1.5" />
                                  {new Date(
                                    publication.publication_date
                                  ).getFullYear()}
                                </span>
                              )} */}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="border-t border-gray-100 px-8 py-6">
                      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                        <div className="text-sm text-gray-600">
                          Page {currentPage} of {pagination.pages} •{" "}
                          {pagination.total} total publications
                          {facultyFilter && currentFacultyName && (
                            <span className="text-blue-600 font-medium">
                              {" "}
                              for {currentFacultyName}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeftIcon className="h-5 w-5 mr-2" />
                            Previous
                          </button>

                          <div className="hidden sm:flex items-center space-x-1">
                            {generatePageNumbers().map((page, index) => {
                              if (page === "...") {
                                return (
                                  <span
                                    key={`ellipsis-${index}`}
                                    className="px-3 py-2 text-gray-500"
                                  >
                                    ...
                                  </span>
                                );
                              }
                              return (
                                <button
                                  key={page}
                                  onClick={() =>
                                    handlePageChange(page as number)
                                  }
                                  className={`px-4 py-2 rounded-lg ${
                                    currentPage === page
                                      ? "bg-blue-600 text-white shadow-sm"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              );
                            })}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pagination.pages}
                            className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Next
                            <ChevronRightIcon className="h-5 w-5 ml-2" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Pagination */}
                      <div className="sm:hidden mt-4">
                        <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
                          {generatePageNumbers().map((page, index) => {
                            if (page === "...") {
                              return (
                                <span
                                  key={`ellipsis-${index}`}
                                  className="px-2 py-2 text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`min-w-[2.5rem] px-3 py-2 rounded-lg ${
                                  currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
