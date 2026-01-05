"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Header from "@/app/components/website/Header";
import Footer from "@/app/components/website/Footer";

interface Faculty {
  name: string;
  email?: string;
  institute?: string;
  _id?: string;
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: string;
  category: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface News {
  _id: string;
  title: string;
  content: string;
  facultyInvolved: Faculty[];
  Url: string;
  createdBy: string;
  published: boolean;
  createdAt: string;
}

interface FacultyCount {
  regular: number;
  adjunct: number;
}

interface FacultyData {
  category: string;
  published: boolean;
  isActive: boolean;
}

interface DepartmentStats {
  scholars: number;
  btech: number;
  mtech: number;
  journals: number;
  conferences: number;
  books: number;
  staff: number;
}

interface Scholar {
  published: boolean;
  isActive: boolean;
}

interface Book {
  published: boolean;
}

interface Staff {
  published: boolean;
  isActive: boolean;
}

interface APISliderItem {
  id: string;
  image: string;
  title: string;
  description: string;
  event_date: string;
  dept: string;
  created_by: string;
  created_at: string;
  image_url: string;
}

interface SliderImage {
  _id: string;
  title: string;
  caption: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
   HELPER FUNCTIONS FOR PHP PUBLICATIONS
-------------------------------- */
// Function to parse publication details into structured format
interface ParsedPublication {
  authors: string;
  title: string;
  journal: string;
  year: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
}

const parsePublicationString = (details: string): ParsedPublication | null => {
  try {
    // Remove HTML tags
    const cleanText = details.replace(/<[^>]*>/g, "").trim();

    // Sample format: "Andreas Brüggemann, Nishat Koti, Varsha Bhat Kukkala, and Thomas Schneider,
    // "Multicent: Secure and Scalable Computation of Centrality Measures on Multilayer Graphs",
    // Proceedings on Privacy Enhancing Technologies (2025), vol 2025, issue 4, pp. 944–968,
    // doi: https://doi.org/10.56553/popets-2025-0166"

    // Extract title (content within double quotes)
    const titleMatch = cleanText.match(/"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : cleanText;

    // Extract authors (everything before the first double quote, remove trailing comma)
    let authors = "";
    if (titleMatch && titleMatch.index) {
      authors = cleanText
        .substring(0, titleMatch.index)
        .replace(/,\s*$/, "")
        .trim();
    }

    // Extract year (look for 4-digit number in parentheses)
    const yearMatch = cleanText.match(/\((\d{4})\)/);
    const year = yearMatch ? yearMatch[1] : "";

    // Extract journal (look for text after title until year or comma)
    let journal = "";
    if (titleMatch && titleMatch.index) {
      const afterTitle = cleanText.substring(
        titleMatch.index + titleMatch[0].length
      );
      // Remove "Proceedings on" prefix if present
      journal = afterTitle
        .replace(/^,\s*Proceedings on\s*/i, "")
        .replace(/^,\s*/i, "")
        .split(/\((\d{4})\)/)[0]
        .trim()
        .replace(/,\s*$/, "");
    }

    // Extract DOI (look for doi: pattern)
    const doiMatch = cleanText.match(/doi:\s*(https?:\/\/doi\.org\/[^\s,]+)/i);
    const doi = doiMatch ? doiMatch[1] : "";

    // Extract volume, issue, pages
    const volumeMatch = cleanText.match(/vol\s+([^,]+)/i);
    const issueMatch = cleanText.match(/issue\s+([^,]+)/i);
    const pagesMatch = cleanText.match(/pp\.\s+([^,]+)/i);

    return {
      authors,
      title,
      journal:
        journal || cleanText.split(",").slice(-2, -1)[0]?.trim() || "Journal",
      year,
      volume: volumeMatch ? volumeMatch[1] : undefined,
      issue: issueMatch ? issueMatch[1] : undefined,
      pages: pagesMatch ? pagesMatch[1] : undefined,
      doi,
      url: doi || undefined,
    };
  } catch (error) {
    console.error("Error parsing publication string:", error);
    return null;
  }
};

const formatPublicationText = (pub: PHPPublication): string => {
  try {
    const parsed = parsePublicationString(pub.details);
    if (parsed) {
      return parsed.title;
    }

    // Fallback: Extract title from details (remove HTML tags)
    const title = pub.details
      ? pub.details
          .replace(/<[^>]*>/g, "")
          .replace(/&[a-z]+;/g, " ")
          .trim()
      : "Untitled Publication";
    return title;
  } catch (error) {
    console.error("Error formatting publication:", error);
    return "Publication details not available";
  }
};

// const extractCategoriesFromPublications = (
//   pubs: PHPPublication[]
// ): string[] => {
//   const categories = new Set<string>();
//   pubs.forEach((pub) => {
//     if (pub.type && pub.type.trim()) {
//       categories.add(pub.type.trim());
//     }
//   });
//   return Array.from(categories).sort();
// };

// Animation variants with proper typing
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Fetch publications from PHP API
const fetchPHPPublications = async (): Promise<PHPPublication[]> => {
  try {
    // Fetch publications for all faculty members in parallel
    const fetchPromises = Object.values(SLUG_TO_EID_MAP).map(async (eid) => {
      try {
        const response = await fetch(
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
    });

    const results = await Promise.all(fetchPromises);
    const allPubs = results.flat();

    // Sort by date (newest first)
    return allPubs.sort((a, b) => {
      const dateA = a.publication_date
        ? new Date(a.publication_date).getTime()
        : 0;
      const dateB = b.publication_date
        ? new Date(b.publication_date).getTime()
        : 0;
      return dateB - dateA;
    });
  } catch (err) {
    console.error("Error fetching all publications:", err);
    return [];
  }
};

// Fetch slider images from local API
const fetchSliderImages = async () => {
  try {
    const response = await fetch(`http://localhost:8080/sai/sliders/`, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Failed to fetch slider images");
      return [];
    }

    const data = await response.json();
    const sliders = Array.isArray(data) ? data : data.sliders || data.data || [];
    
    // Map the API response to SliderImage interface
    const mappedSliders = sliders.map((item: APISliderItem) => ({
      _id: item.id,
      title: item.title,
      caption: item.description,
      imageUrl: item.image_url,
      linkUrl: undefined,
      isActive: true, // Assuming all fetched sliders are active
      createdAt: item.created_at,
      updatedAt: item.created_at,
    }));

    // Sort by createdAt descending and take the most recent 10
    return mappedSliders
      .sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
};

// Fetch news from local API
const fetchNews = async () => {
  try {
    const response = await fetch(`/api/public/news`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    return (data.data || [])
      .sort(
        (a: News, b: News) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 2);
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export default function HomePage() {
  const [phpPublications, setPhpPublications] = useState<PHPPublication[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [news, setNews] = useState<News[]>([]);
  const [currentLabSlide, setCurrentLabSlide] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [facultyCount, setFacultyCount] = useState<FacultyCount>({
    regular: 0,
    adjunct: 0,
  });
  const [loading, setLoading] = useState(true);
  const [departmentCounts, setDepartmentCounts] = useState<DepartmentStats>({
    scholars: 0,
    btech: 0,
    mtech: 0,
    journals: 0,
    conferences: 0,
    books: 0,
    staff: 0,
  });
  const [phpLoading, setPhpLoading] = useState(true);

  const departmentStats = [
    {
      figure: loading ? "..." : facultyCount.regular.toString(),
      label: "Faculty Members",
      url: "/people/faculty",
    },
    {
      figure: loading ? "..." : facultyCount.adjunct.toString(),
      label: "Adjunct/ Guest Faculty",
      url: "/people/faculty",
    },
    {
      figure: loading ? "..." : departmentCounts.staff.toString(),
      label: "Staff",
      url: "/people/staff",
    },
    {
      figure: loading ? "..." : departmentCounts.scholars.toString(),
      label: "Research Scholars (M.S & Ph.D)",
      url: "/people/research-scholars",
    },
    {
      figure: loading ? "..." : departmentCounts.btech.toString(),
      label: "B.Tech Students",
      url: "/people/students",
    },
    {
      figure: loading ? "..." : departmentCounts.mtech.toString(),
      label: "M.Tech Students",
      url: "/people/students",
    },
    {
      figure: phpLoading ? "..." : departmentCounts.journals.toString(),
      label: "Journals",
      url: "/research/publications",
    },
    {
      figure: phpLoading ? "..." : departmentCounts.conferences.toString(),
      label: "Conferences",
      url: "/research/publications",
    },
    {
      figure: loading ? "..." : departmentCounts.books.toString(),
      label: "Books",
      url: "/research/books",
    },
  ];

  const labImages = [
    {
      image: "/assets/images/labs/ssl.jpeg",
      title: "System Security Lab",
    },
    {
      image: "/assets/images/labs/dsl.jpg",
      title: "Data Science Lab",
    },
  ];

  // Fetch PHP Publications
  useEffect(() => {
    const getPHPPublications = async () => {
      try {
        setPhpLoading(true);
        const data = await fetchPHPPublications();
        setPhpPublications(data);

        // Count journals and conferences from PHP publications
        const journalsCount = data.filter(
          (pub) => pub.type && pub.type.toLowerCase().includes("journal")
        ).length;

        const conferencesCount = data.filter(
          (pub) => pub.type && pub.type.toLowerCase().includes("conference")
        ).length;

        setDepartmentCounts((prev) => ({
          ...prev,
          journals: journalsCount,
          conferences: conferencesCount,
        }));
      } catch (error) {
        console.error("Error fetching PHP publications:", error);
      } finally {
        setPhpLoading(false);
      }
    };

    getPHPPublications();
  }, []);

  // Fetch News
  useEffect(() => {
    const getNews = async () => {
      const data = await fetchNews();
      const activeNews = data.filter((news: News) => news.published);
      setNews(activeNews);
    };
    getNews();
  }, []);

  // Fetch Slider Images
  useEffect(() => {
    const getSliderImages = async () => {
      const data = await fetchSliderImages();
      const activeSliders = data.filter(
        (slider: SliderImage) => slider.isActive
      );
      setSliderImages(activeSliders);
    };
    getSliderImages();
  }, []);

  // Auto-rotate slider
  useEffect(() => {
    if (sliderImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderImages.length]);

  // Auto-rotate lab slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLabSlide((prev) => (prev + 1) % labImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [labImages.length]);

  // Fetch other data from local APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsData] = await Promise.all([
          fetch("/api/public/announcements").then((res) => res.json()),
        ]);
        setAnnouncements(announcementsData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fetch faculty count
  useEffect(() => {
    const fetchFacultyCount = async () => {
      try {
        const res = await fetch("/api/public/faculty-information?limit=100");
        if (!res.ok) throw new Error("Failed to fetch faculty data");
        const response = await res.json();
        const facultyData = response.data;

        const regularFaculty = facultyData.filter(
          (faculty: FacultyData) =>
            faculty.category === "Regular" &&
            faculty.published &&
            faculty.isActive
        ).length;

        const adjunctFaculty = facultyData.filter(
          (faculty: FacultyData) =>
            faculty.category !== "Regular" &&
            faculty.published &&
            faculty.isActive
        ).length;

        setFacultyCount({ regular: regularFaculty, adjunct: adjunctFaculty });
      } catch (error) {
        console.error("Error fetching faculty count:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyCount();
  }, []);

  // Fetch other counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const staffRes = await fetch("/api/public/staff-information");
        const staffData = await staffRes.json();
        const staffCount = staffData.data.filter(
          (staff: Staff) => staff.published && staff.isActive
        ).length;

        const scholarsRes = await fetch(
          "/api/public/scholar-information?limit=100"
        );
        const scholarsData = await scholarsRes.json();
        const scholarsCount = scholarsData.data.filter(
          (scholar: Scholar) => scholar.published && scholar.isActive
        ).length;

        const studentsRes = await fetch(
          "/api/public/student-information?limit=500"
        );
        const studentsData = await studentsRes.json();

        const btechCount = studentsData.stats.totalBTech;
        const mtechCount = studentsData.stats.totalMTech;

        const booksRes = await fetch("/api/public/books?limit=100");
        const booksData = await booksRes.json();
        const booksCount = booksData.data.filter(
          (book: Book) => book.published
        ).length;

        // Update department counts (journals and conferences are already set from PHP API)
        setDepartmentCounts((prev) => ({
          ...prev,
          scholars: scholarsCount,
          btech: btechCount,
          mtech: mtechCount,
          books: booksCount,
          staff: staffCount,
        }));
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  // Get top 3 recent publications from PHP API
  const recentPublications = phpPublications.slice(0, 3);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-32 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-50 transition-all duration-300 hover:scale-110"
            aria-label="Back to top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <Header isTransparent={true} />

      {/* Slider Section - Same as before */}
      <div className="relative h-[40vh] min-h-[400px] md:h-[calc(100vh-48px)] overflow-hidden mt-0">
        <AnimatePresence mode="wait">
          {sliderImages.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 h-full w-full"
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
                <div className="h-full w-full relative">
                  <div className="h-full w-full transform scale-[0.98] md:scale-100 transition-transform duration-300">
                    <Image
                      src={sliderImages[currentSlide].imageUrl}
                      alt={`Slide ${currentSlide + 1}`}
                      fill
                      priority
                      unoptimized
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.style.display = "none";
                          target.parentElement.style.backgroundColor =
                            currentSlide % 2 === 0 ? "#1d4ed8" : "#4338ca";
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 z-20 flex items-end md:items-center justify-start px-4 md:px-16 lg:px-24 pb-8 md:pb-0">
                <div className="max-w-xl text-white w-full">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-xl md:text-5xl font-bold mb-4"
                  >
                    {sliderImages[currentSlide].title}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-sm md:text-xl mb-8 text-white/90"
                  >
                    {sliderImages[currentSlide].caption}
                    {sliderImages[currentSlide].linkUrl && (
                      <Link
                        href={sliderImages[currentSlide].linkUrl || "#"}
                        target="_blank"
                        className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-yellow-600 transition duration-300 text-xs md:text-base"
                      >
                        View more..!
                      </Link>
                    )}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {sliderImages.length > 0 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                } transition-all duration-300`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        )}

        {sliderImages.length > 0 && (
          <>
            <button
              onClick={() =>
                setCurrentSlide(
                  (prev) =>
                    (prev - 1 + sliderImages.length) % sliderImages.length
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
              aria-label="Previous slide"
            >
              <ChevronRightIcon className="w-6 h-6 text-white rotate-180" />
            </button>
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {/* News Section - Same as before */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.div variants={fadeIn} className="inline-block mb-6">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute -inset-2 bg-blue-100 rounded-full opacity-70"
                ></motion.div>
                <motion.h2
                  variants={fadeIn}
                  className="relative text-3xl md:text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="inline-block text-3xl"
                  >
                    📢
                  </motion.span>
                  Latest News
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                    className="inline-block text-2xl"
                  >
                    👏👏
                  </motion.span>
                </motion.h2>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn}
              className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"
            ></motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {news.length > 0 ? (
              news.map((newsItem, index) => {
                const facultyNames = newsItem.facultyInvolved
                  ?.map((f) => f.name)
                  ?.filter(Boolean);
                const formatter = new Intl.ListFormat("en", {
                  style: "long",
                  type: "conjunction",
                });
                const formattedFaculty =
                  facultyNames?.length > 0
                    ? formatter.format(facultyNames)
                    : "our faculty members";

                return (
                  <motion.div
                    key={newsItem._id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                      damping: 10,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    }}
                    className="bg-white rounded-xl p-6 shadow-lg border border-blue-100/50 hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {new Date(newsItem.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>🎉</span> Hearty Congratulations to{" "}
                      {formattedFaculty}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-10">
                      The work &quot;
                      <span className="text-blue-600 font-medium">
                        {newsItem.title}
                      </span>
                      &quot; {newsItem.content}
                    </p>
                    {newsItem.Url && (
                      <a
                        href={newsItem.Url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Read more →
                      </a>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-2 text-center py-8">
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <svg
                    className="w-12 h-12 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  <p className="text-gray-600">No recent news available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Publications Section - UPDATED FOR PHP API WITH PARSING */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-white/90"></div>
          <Image
            src="/assets/images/publications-bg.png"
            alt="Publications Background"
            fill
            style={{ objectFit: "cover", opacity: 0.3 }}
            priority
            className="pointer-events-none"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent mb-3"
            >
              Recent Publications
            </motion.h2>
            <motion.div
              variants={fadeIn}
              className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"
            ></motion.div>
            <motion.p
              variants={fadeIn}
              className="max-w-2xl mx-auto text-white text-bold text-lg"
            >
              Discover our latest research contributions to the field of
              Computer Science
            </motion.p>
          </motion.div>

          {phpLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-white">
                Loading publications from database...
              </p>
            </div>
          ) : recentPublications.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {recentPublications.map((pub, index) => {
                  const parsed = parsePublicationString(pub.details);
                  const facultyName =
                    EID_TO_NAME_MAP[pub.eid] || `Faculty (EID: ${pub.eid})`;

                  return (
                    <motion.div
                      key={`${pub.eid}-${pub.sno}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3 },
                      }}
                      className="relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100"
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <div className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                          {pub.type || "Publication"}
                        </div>
                      </div>

                      <div className="p-6 flex-grow">
                        <div className="mb-4">
                          <div className="w-12 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4"></div>
                          <h3
                            className="text-xl font-bold text-gray-800 mb-3 line-clamp-3"
                            title={parsed?.title || formatPublicationText(pub)}
                          >
                            {parsed?.title || formatPublicationText(pub)}
                          </h3>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1 text-blue-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm text-gray-700 font-medium line-clamp-2">
                                {parsed?.authors ? (
                                  <span className="text-gray-700">
                                    {parsed.authors}
                                  </span>
                                ) : (
                                  <Link
                                    href={`/research/publications?faculty=${pub.eid}`}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    {facultyName}
                                  </Link>
                                )}
                              </p>
                              {!parsed?.authors && (
                                <p className="text-xs text-gray-500 mt-1">
                                  From: {facultyName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-start">
                            <div className="mr-3 mt-1 text-blue-600">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            </div>
                            <div className="text-sm text-gray-700">
                              {parsed ? (
                                <>
                                  <span className="font-semibold">
                                    {parsed.journal}
                                  </span>
                                  {parsed.year && (
                                    <>
                                      <span> ({parsed.year})</span>
                                      <div className="mt-1 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {parsed.year}
                                      </div>
                                    </>
                                  )}
                                  {parsed.volume && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Volume: {parsed.volume}
                                      {parsed.issue &&
                                        `, Issue: ${parsed.issue}`}
                                      {parsed.pages &&
                                        `, Pages: ${parsed.pages}`}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div>
                                  <span className="font-semibold">
                                    {pub.type || "Publication"}
                                  </span>
                                  {pub.publication_date && (
                                    <div className="mt-1 ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {new Date(
                                        pub.publication_date
                                      ).getFullYear()}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        {parsed?.url ? (
                          <a
                            href={parsed.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all"
                          >
                            Read Publication
                            <svg
                              className="w-5 h-5 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                              ></path>
                            </svg>
                          </a>
                        ) : (
                          <Link
                            href={`/research/publications?faculty=${pub.eid}`}
                            className="inline-flex items-center justify-center w-full py-2.5 px-4 text-sm font-medium text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all"
                          >
                            View Publication Details
                            <svg
                              className="w-5 h-5 ml-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 5l7 7-7 7M5 5l7 7-7 7"
                              ></path>
                            </svg>
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-center mt-12"
              >
                <Link
                  href="/research/publications"
                  className="inline-flex items-center justify-center py-3 px-6 text-base font-medium text-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all shadow-md hover:shadow-lg"
                >
                  View All Publications
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
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
                <p className="text-gray-600 mb-2">No publications available</p>
                <p className="text-gray-500 text-sm">
                  Check back later for updates on our research publications.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About Department Section - Same as before */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-200 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-10 relative"
          >
            <div className="absolute top-0 left-1/4 w-16 h-16 rounded-full bg-blue-100/50 -z-10"></div>
            <div className="absolute bottom-0 right-1/4 w-24 h-24 rounded-full bg-indigo-100/50 -z-10"></div>

            <motion.div
              variants={pulseAnimation}
              initial="initial"
              animate="animate"
              className="inline-block"
            >
              <motion.h2
                variants={fadeIn}
                className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700"
              >
                About the Department
              </motion.h2>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="w-32 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 mx-auto mb-4 rounded-full"
            ></motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></div>
                  Department Overview
                </h3>

                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed text-justify">
                    <span className="text-blue-600 font-bold text-xl mr-2">
                      &ldquo;
                    </span>
                    The Department of Computer Science and Engineering at IIT
                    Tirupati, founded in 2015, is a rapidly growing and dynamic
                    department offering academic and research programs including
                    B.Tech, M.Tech, M.S (Research), and PhD.
                  </p>

                  <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
                    <p className="text-gray-700 leading-relaxed text-justify">
                      The programmes offered by the department follow a rigorous
                      and diversified course curriculum with emphasis on
                      fundamentals, project-driven and industry relevant
                      courses. The M.Tech programme in CSE focuses on Data
                      Science and Systems. The faculty members are actively
                      engaged in research areas including algorithms, artificial
                      intelligence, machine learning, computer networks,
                      software engineering, computer organisation and
                      architecture, parallel computing, theoretical computer
                      science and mathematical modeling.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed text-justify">
                      Faculty members also engage in interesting projects at the
                      congruence of academic-industry research problems, and
                      currently has collaborations with Toshiba R&D, Facebook,
                      Bosch R&D, Accenture Labs. The Data Science & Systems and
                      Cybersecurity are key areas in which the department plans
                      to grow and develop expertise and human resources to meet
                      the needs of the Nation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Department at a Glance
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {departmentStats.slice(0, 6).map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                      >
                        <Link href={`${stat.url}`} title={stat.label}>
                          <div className="text-xl font-bold text-blue-600">
                            {stat.figure}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-1">
                            {stat.label}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-1.5 h-6 bg-indigo-600 rounded-full mr-3"></div>
                  Vision & Mission
                </h3>

                <div className="mb-6">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Vision
                      </h4>
                      <p className="text-gray-600 leading-relaxed text-justify">
                        To perform innovative and impactful research for social
                        good and create lifelong learners in fields of computing
                        through rigorous academic culture and creative
                        problem-solving.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">
                        Mission
                      </h4>
                      <ul className="space-y-2 text-justify">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5 text-xs font-bold">
                            1
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            To nurture students&apos; abilities with a vibrant
                            and rigorous academic environment towards utilizing
                            theoretical and practical knowledge of computing
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5 text-xs font-bold">
                            2
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            To create significant new knowledge and impact on
                            academia, industry and society through innovative
                            and cutting-edge research in computing and
                            interdisciplinary areas
                          </p>
                        </li>
                        <li className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5 text-xs font-bold">
                            3
                          </div>
                          <p className="text-gray-600 leading-relaxed">
                            To empower individuals and teams to foster creative
                            thinking and create innovative solutions for real
                            world challenges
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Our Academic & Research Labs
                  </h4>
                  <div className="relative h-80 rounded-lg overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentLabSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0"
                      >
                        <div className="relative h-full w-full">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                          <Image
                            src={labImages[currentLabSlide].image}
                            alt={`Lab ${currentLabSlide + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.parentElement) {
                                target.style.display = "none";
                                target.parentElement.style.backgroundColor =
                                  "#1e40af";
                              }
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-3 z-20 text-white">
                            <h3 className="font-bold text-sm">
                              {labImages[currentLabSlide].title}
                            </h3>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute bottom-2 right-2 z-20 flex space-x-1">
                      {labImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentLabSlide(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentLabSlide === index
                              ? "bg-white"
                              : "bg-white/40"
                          }`}
                          aria-label={`Go to lab slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></div>
                  Message from the HOD
                </h3>

                <div className="flex flex-col items-center mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-3 bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                    <div className="rounded-full overflow-hidden h-full w-full relative">
                      <Image
                        src="/assets/images/head.jpeg"
                        alt="Head of Department"
                        fill
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.parentElement!.classList.add("bg-blue-600");
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900">
                    Dr. Sridhar Chimalakonda
                  </h4>
                  <p className="text-base text-blue-600 mb-2">
                    Associate Professor & Head of the Department
                  </p>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <svg
                      className="w-4 h-4 text-blue-600 mr-1"
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
                    <span>
                      <a
                        href="mailto:hod_cse@iittp.ac.in"
                        className="text-blue-600 text-base"
                      >
                        hod_cse@iittp.ac.in
                      </a>
                    </span>
                  </div>
                </div>

                <div className="text-gray-600 space-y-3 text-justify">
                  <p className="relative border-l-2 border-blue-200 pl-4 italic text-base">
                    We, the Department of Computer Science and Engineering (CSE)
                    at IIT Tirupati focus on top-quality research, empower our
                    students through hands-on driven curriculum, and contribute
                    to society through computing! Our academic programs (B.Tech,
                    M.Tech, M.S (Research), and Ph.D) follow a rigorous and
                    diversified curriculum with an emphasis on fundamentals,
                    project-driven, and industry-relevant courses.
                  </p>

                  <p className="text-base">
                    The department is rapidly growing and has young and
                    enthusiastic faculty members, who are actively engaged in
                    research areas such as algorithmic engineering, AI/ML,
                    computer vision, networks, software engineering, AI
                    accelerator, parallel computing, complexity theory. Despite
                    being a relatively young department, the faculty members
                    have received funding from organizations such as DST,
                    ANRF/SERB, ISRO, Toshiba R&D, Bosch R&D, Accenture Labs,
                    Meta and awards from research wings of Google, IBM,
                    Microsoft.
                  </p>

                  <p className="text-base">
                    The department also actively nurtures research at the
                    undergraduate level potentially leading to both publications
                    and platforms/tools. Based on our students&apos; active
                    participation in technical and programming contests, and
                    with their internships in reputed R&D industries and
                    universities in India and abroad, we wish them the best in
                    their careers.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-3 gap-2">
                    {departmentStats.slice(6, 9).map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="text-center p-2 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                      >
                        <Link href={`${stat.url}`} title={stat.label}>
                          <div className="text-xl font-bold text-purple-600">
                            {stat.figure}
                          </div>
                          <div className="text-xs text-gray-600 line-clamp-1">
                            {stat.label}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-pink-700 to-violet-600 rounded-xl p-6 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <div className="w-1.5 h-5 bg-blue-600 rounded-full mr-2"></div>
                Research Highlights & Collaborations
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-blue-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Artificial Intelligence
                </h4>
                <p className="text-xs text-gray-600">
                  Machine learning, deep learning, and computer vision research
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-indigo-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Cybersecurity
                </h4>
                <p className="text-xs text-gray-600">
                  Network security, cryptography, and secure systems
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-purple-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Data Science
                </h4>
                <p className="text-xs text-gray-600">
                  Big data analytics and data-driven decision systems
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="text-pink-600 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1v-3a1 1 0 011-1h3a1 1 0 001-1V4z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  Industry Partners
                </h4>
                <p className="text-xs text-gray-600">
                  Collaborations with Toshiba, Microsoft, Google, Bosch, etc.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Announcement Ticker - Same as before */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-500 py-2.5 z-50 shadow-lg border-t border-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white text-blue-600 font-bold px-3 py-1 rounded-full mr-4 text-sm">
              ANNOUNCEMENT
            </div>
            <div
              className="overflow-hidden relative w-full"
              aria-live="polite"
              aria-atomic="true"
            >
              {announcements.length > 0 ? (
                <div className="whitespace-nowrap inline-block animate-marquee">
                  {announcements.map((announcement, index) => (
                    <Link
                      href={`/activities/announcements#${announcement._id}`}
                      key={announcement._id}
                      className="inline-block text-white hover:text-blue-100 transition-colors mr-12"
                      title={announcement.title}
                    >
                      <span className="font-semibold">
                        {announcement.title}
                      </span>
                      {announcement.priority === "high" && (
                        <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Important
                        </span>
                      )}
                      {index < announcements.length - 1 && (
                        <span className="mx-6 text-white/50">|</span>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-white">No current announcements</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pb-4">
        <Footer />
      </div>
    </div>
  );
}
