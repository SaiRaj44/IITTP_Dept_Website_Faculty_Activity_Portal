"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

/* -----------------------------
   TEMP SLUG → EMPID MAPPING
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
   NEXT.JS API TYPES
-------------------------------- */
interface FacultyInformation {
  _id: string;
  category: "Regular" | "Adjunct" | "Guest";
  name: string;
  designation: "Assistant Professor" | "Associate Professor" | "Professor";
  email: string;
  phone: string;
  imageUrl: string;
  profileUrl: string;
  researchInterests: string;
  education: string;
  order: number;
  office: string;
  webpage: string;
  isActive: boolean;
}

interface Project {
  _id: string;
  category:
    | "RBIC Project"
    | "Industrial Consultancy"
    | "Consultancy Project"
    | "Sponsored Project";
  title: string;
  facultyInvolved: Array<{ name: string; institute: string; _id: string }>;
  year: string;
  industry: string;
  amount: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

interface Book {
  _id: string;
  title: string;
  authors: string;
  publisher: string;
  chapter: string;
  year: number;
  isbn: string;
  url: string;
  facultyInvolved: Array<{ name: string; institute: string; _id: string }>;
}

interface Patent {
  _id: string;
  title: string;
  inventors: string;
  patentNumber: string;
  country: string;
  year: number;
  status: string;
  facultyInvolved: Array<{ name: string; institute: string; _id: string }>;
}

interface Scholar {
  _id: string;
  category: string;
  name: string;
  imageUrl: string;
  year: string;
  batch: string;
  facultyInvolved: Array<{ name: string; institute: string; _id: string }>;
  domain: string;
  email: string;
  isActive: boolean;
  order: number;
  published: boolean;
}

/* -----------------------------
   HELPER FUNCTION TO FORMAT PHP PUBLICATION TEXT
-------------------------------- */
const formatPublicationText = (
  pub: PHPPublication
  // facultyName: string
): string => {
  try {
    // Extract title from details (remove HTML tags)
    const title = pub.details
      ? pub.details
          .replace(/<[^>]*>/g, "")
          .replace(/&[a-z]+;/g, " ")
          .trim()
      : "Untitled Publication";

    // Format authors (using faculty name)
    // const authors = facultyName ? `${facultyName}` : "Faculty Member";

    // Get year from publication date
    // const year = pub.publication_date
    //   ? new Date(pub.publication_date).getFullYear()
    //   : new Date().getFullYear();

    // Get journal/conference from type
    // const journal = pub.type || "Journal";

    // Construct the formatted string
    return ` ${title}.`;
  } catch (error) {
    console.error("Error formatting publication:", error);
    return "Publication details not available";
  }
};

export default function ClientPage({ slug: propSlug }: { slug?: string }) {
  const params = useParams();
  const slug = (propSlug as string) || (params?.slug as string);

  // Get EID from slug mapping
  const eid = SLUG_TO_EID_MAP[slug];

  const [faculty, setFaculty] = useState<FacultyInformation | null>(null);
  const [phpPublications, setPhpPublications] = useState<PHPPublication[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [patents, setPatents] = useState<Patent[]>([]);
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phpPublicationsLoading, setPhpPublicationsLoading] = useState(false);
  const [phpPublicationsError, setPhpPublicationsError] = useState<
    string | null
  >(null);

  /* -----------------------------
     FETCH DATA FROM NEXT.JS APIS
  -------------------------------- */
  useEffect(() => {
    const fetchNextJSData = async () => {
      if (!slug) {
        setError("Invalid faculty ID");
        setLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel (except PHP publications)
        const [facultyRes, projRes, booksRes, patentsRes, scholarsRes] =
          await Promise.all([
            fetch("/api/public/faculty-information?limit=20"),
            fetch("/api/public/projects?limit=30"),
            fetch("/api/public/books?limit=15"),
            fetch("/api/public/patents?limit=20"),
            fetch("/api/public/scholar-information?limit=50"),
          ]);

        // Check if all responses are ok
        if (
          !facultyRes.ok ||
          !projRes.ok ||
          !booksRes.ok ||
          !patentsRes.ok ||
          !scholarsRes.ok
        ) {
          throw new Error("Failed to fetch data from Next.js APIs");
        }

        // Process faculty data
        const facultyResponse = await facultyRes.json();
        const facultyData = facultyResponse.data || facultyResponse;

        if (!Array.isArray(facultyData)) {
          throw new Error("Invalid faculty data format");
        }

        const currentFaculty = facultyData.find(
          (f: FacultyInformation) => f.profileUrl === slug
        );

        if (!currentFaculty) {
          throw new Error("Faculty not found");
        }

        setFaculty(currentFaculty);

        // Process other data
        const [projResponse, booksResponse, patentsResponse, scholarsResponse] =
          await Promise.all([
            projRes.json(),
            booksRes.json(),
            patentsRes.json(),
            scholarsRes.json(),
          ]);

        // Filter and set data for each section
        const projData = Array.isArray(projResponse)
          ? projResponse
          : projResponse.data;
        if (Array.isArray(projData)) {
          const facultyProjs = projData
            .filter((proj: Project) =>
              proj.facultyInvolved?.some((f) => f.institute === slug)
            )
            .slice(0, 3);
          setProjects(facultyProjs);
        }

        const booksData = Array.isArray(booksResponse)
          ? booksResponse
          : booksResponse.data;
        if (Array.isArray(booksData)) {
          const facultyBooks = booksData
            .filter((book: Book) =>
              book.facultyInvolved?.some((f) => f.institute === slug)
            )
            .slice(0, 3);
          setBooks(facultyBooks);
        }

        const patentsData = Array.isArray(patentsResponse)
          ? patentsResponse
          : patentsResponse.data;
        if (Array.isArray(patentsData)) {
          const facultyPatents = patentsData
            .filter((patent: Patent) =>
              patent.facultyInvolved?.some((f) => f.institute === slug)
            )
            .slice(0, 3);
          setPatents(facultyPatents);
        }

        const scholarsData = Array.isArray(scholarsResponse)
          ? scholarsResponse
          : scholarsResponse.data;
        if (Array.isArray(scholarsData)) {
          const facultyScholars = scholarsData.filter((scholar: Scholar) =>
            scholar.facultyInvolved?.some((f) => f.institute === slug)
          );
          setScholars(facultyScholars);
        }
      } catch (err) {
        console.error("Error fetching Next.js data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNextJSData();
  }, [slug]);

  /* -----------------------------
     FETCH PUBLICATIONS FROM PHP DOCKER API
  -------------------------------- */
  useEffect(() => {
    const fetchPHPPublications = async () => {
      if (!eid) {
        console.log("No EID mapping found for slug:", slug);
        return;
      }

      setPhpPublicationsLoading(true);
      setPhpPublicationsError(null);

      try {
        const res = await fetch(
          // `http://localhost:8080/api/publications.php?eid=${eid}`,
          `https://cse.iittp.ac.in/sai/publications.php?eid=${eid}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`PHP API request failed with status: ${res.status}`);
        }

        const data: PHPResponse = await res.json();

        // Get only the 3 most recent publications
        const recentPublications = (data.publications || [])
          .sort((a, b) => {
            // Sort by date descending (newest first)
            const dateA = a.publication_date
              ? new Date(a.publication_date).getTime()
              : 0;
            const dateB = b.publication_date
              ? new Date(b.publication_date).getTime()
              : 0;
            return dateB - dateA;
          })
          .slice(0, 3); // Get top 3

        setPhpPublications(recentPublications);
      } catch (err) {
        console.error("Error fetching PHP publications:", err);
        setPhpPublicationsError(
          err instanceof Error ? err.message : "Failed to load publications"
        );
      } finally {
        setPhpPublicationsLoading(false);
      }
    };

    // Fetch PHP publications only if we have an EID mapping
    if (eid) {
      fetchPHPPublications();
    }
  }, [eid, slug]);

  /* -----------------------------
     UI COMPONENTS
  -------------------------------- */
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 p-6">
            <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto"></div>
          </div>
          <div className="md:w-2/3 p-8">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );

  const SectionHeader = ({
    title,
    viewAllLink,
    hasViewAll = true,
  }: {
    title: string;
    viewAllLink?: string;
    hasViewAll?: boolean;
  }) => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <div className="w-1 h-10 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {hasViewAll && viewAllLink && (
        <Link
          href={viewAllLink}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 group"
        >
          View All
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
      )}
    </div>
  );

  const SectionWrapper = ({
    children,
    title,
    viewAllLink,
    delay = 0,
    hasViewAll = true,
  }: {
    children: React.ReactNode;
    title: string;
    viewAllLink?: string;
    delay?: number;
    hasViewAll?: boolean;
  }) => (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="mb-16"
    >
      <SectionHeader
        title={title}
        viewAllLink={viewAllLink}
        hasViewAll={hasViewAll}
      />
      {children}
    </motion.section>
  );

  /* -----------------------------
     LOADING STATE
  -------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  /* -----------------------------
     ERROR STATE
  -------------------------------- */
  if (error || !faculty) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Faculty not found"}
          </h1>
          <Link
            href="/people/faculty"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Faculty List
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  /* -----------------------------
     MAIN RENDER
  -------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Faculty Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-gray-100"
        >
          <div className="md:flex">
            <div className="md:w-1/3 p-8">
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <Image
                  src={faculty.imageUrl || "/placeholder.png"}
                  alt={faculty.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div className="mb-8">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-4xl font-bold text-gray-900 mb-3"
                >
                  {faculty.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-blue-600 font-semibold text-lg"
                >
                  {faculty.designation}
                </motion.p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-gray-500 font-medium mb-4 flex items-center text-lg">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 2c-3.866 0-7 3.134-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 11a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-800 flex items-center text-lg">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {faculty.email}
                    </p>
                    <p className="text-gray-800 flex items-center text-lg">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {faculty.phone}
                    </p>
                    <p className="text-gray-800 flex items-center text-lg">
                      <svg
                        className="w-5 h-5 mr-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {faculty.office}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-gray-500 font-medium mb-4 flex items-center text-lg">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Research Interests
                  </h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {faculty.researchInterests}
                  </p>
                </motion.div>
              </div>

              {faculty.education && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <h3 className="text-gray-500 font-medium mb-4 flex items-center text-lg">
                    <svg
                      className="w-6 h-6 mr-3 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                    Education
                  </h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {faculty.education}
                  </p>
                </motion.div>
              )}

              {faculty.webpage && (
                <motion.a
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  href={faculty.webpage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Personal Webpage
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Publications (from PHP API) - LIST FORMAT */}
        <SectionWrapper
          title="Recent Publications"
          delay={0.2}
          viewAllLink={
            eid ? `/research/publications?faculty=${eid}` : undefined
          }
          hasViewAll={!!eid}
        >
          <div className="mb-6">
            {phpPublicationsLoading && (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading publications from database...
                </div>
              </div>
            )}

            {phpPublicationsError && !phpPublicationsLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-red-800 font-medium">
                      Error loading publications
                    </p>
                    <p className="text-red-600 text-sm">
                      {phpPublicationsError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!eid && !phpPublicationsLoading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-start">
                  <svg
                    className="w-6 h-6 text-yellow-600 mr-3 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="text-yellow-800 font-semibold mb-2">
                      Publications Not Mapped
                    </h4>
                    <p className="text-yellow-700">
                      This faculty member is not yet mapped to the publications
                      database. Publications will appear here once mapping is
                      added to{" "}
                      <code className="bg-yellow-100 px-2 py-1 rounded">
                        SLUG_TO_EID_MAP
                      </code>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            {phpPublications.length === 0 &&
              !phpPublicationsLoading &&
              !phpPublicationsError &&
              eid && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-gray-600">
                      No publications found for this faculty member.
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* PUBLICATIONS LIST FORMAT */}
          {phpPublications.length > 0 && (
            <Card>
              <div className="space-y-6">
                {phpPublications.map((pub, index) => (
                  <motion.div
                    key={pub.sno}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="flex">
                      {/* Number */}
                      <div className="flex-shrink-0 mr-6">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-500 text-white rounded-full font-bold">
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
                              d="M8 4h7l5 5v11a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 4v5h5"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 13h6M9 17h6M9 9h3"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Publication Text */}
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">
                          {formatPublicationText(pub)}
                        </p>

                        {/* Publication Details */}
                        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                          {pub.type && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {pub.type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </SectionWrapper>

        {/* Projects */}
        {projects.length > 0 && (
          <SectionWrapper
            title="Projects"
            viewAllLink={`/research/projects`}
            delay={0.3}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card>
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2"
                      title={project.title}
                    >
                      {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {project.amount}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3 py-1">
                      <span className="text-bold">
                        Industry/ Funding Agency :
                      </span>
                      <p className="px-3 py-1 mt-2 bg-green-100 text-green-800 rounded-full line-clamp-3">
                        {project.industry}
                      </p>
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Books */}
        {books.length > 0 && (
          <SectionWrapper
            title="Books"
            viewAllLink={`/research/books`}
            delay={0.4}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {books.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card>
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p
                      className="text-gray-600 mb-2 text-sm line-clamp-2"
                      title={book.chapter}
                    >
                      {book.chapter}
                    </p>
                    <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                      {book.authors}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {book.publisher} ({book.year})
                    </p>
                    {book.isbn && (
                      <p className="text-gray-500 text-sm mt-2">
                        ISBN: {book.isbn}
                      </p>
                    )}
                    {book.url && (
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 group"
                      >
                        View Book
                        <svg
                          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Patents */}
        {patents.length > 0 && (
          <SectionWrapper
            title="Patents"
            viewAllLink={`/research/patents`}
            delay={0.5}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {patents.map((patent, index) => (
                <motion.div
                  key={patent._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card>
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2"
                      title={patent.title}
                    >
                      {patent.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {patent.patentNumber}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {patent.country}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {patent.status}
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Research Scholars */}
        {scholars.length > 0 && (
          <SectionWrapper
            title="Research Scholars"
            viewAllLink={`/people/research-scholars`}
            delay={0.6}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scholars.map((scholar, index) => (
                <motion.div
                  key={scholar._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="flex items-center gap-6 p-4">
                    {/* Left Side: Image */}
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <Image
                        src={
                          scholar.imageUrl ||
                          "/assets/images/default-profile.png"
                        }
                        alt={scholar.name}
                        width={112}
                        height={112}
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/images/default-profile.png";
                        }}
                      />
                    </div>

                    {/* Right Side: Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {scholar.name}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm ">
                        <span className="text-red-700">Research Area:</span>{" "}
                        {scholar.domain}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {scholar.batch}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {scholar.email}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </SectionWrapper>
        )}
      </div>
    </div>
  );
}
