"use client";
import { useState, useEffect, ReactNode, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import Footer from "@/app/components/layout/Footer";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { fetchApi } from "@/app/utils/api";
import Link from "next/link";
import Header from "@/app/components/layout/Header";

export interface ColumnConfig<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
}

export interface FilterConfig<T> {
  key: keyof T;
  label: string;
  type: "text" | "select" | "date";
  options?: string[];
}

interface GenericListPageProps<T extends Record<string, unknown>> {
  title: string;
  apiEndpoint: string;
  breadcrumbsItems: { label: string; href?: string }[];
  columns: ColumnConfig<T>[];
  modal: React.FC<{
    isOpen: boolean;
    onClose: (success?: boolean) => void;
    item: T | null;
  }>;
  filters?: FilterConfig<T>[];
  extraButtons?: (item: T) => ReactNode;
  idField?: keyof T;
  navItems?: { name: string; href: string; active?: boolean }[];
} // No semicolon needed here

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  message?: string;
}

function TableCell<T>({ content }: { content: T }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [content]);

  const displayContent =
    typeof content === "string" ? content : JSON.stringify(content);

  // Check if content is an array of authors
  const isAuthors =
    Array.isArray(content) &&
    content.length > 0 &&
    content[0].hasOwnProperty("institute");
  interface Author {
    name: string;
    institute?: string;
  }
  if (isAuthors) {
    return (
      <div className="space-y-1">
        {content.map((author: Author, index: number) => (
          <div key={index} className="relative group">
            <div
              className={`${author.institute ? "font-bold" : "font-normal"}`}
            >
              {author.name}
              {author.institute && ` - ${author.institute}`}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        ref={contentRef}
        className="line-clamp-2 group-hover:line-clamp-none transition-all duration-200"
      >
        {displayContent}
      </div>
      {isTruncated && (
        <div
          className={`absolute z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-sm -translate-y-full left-0 mt-1 ${
            showTooltip ? "opacity-100 visible" : "opacity-0 invisible"
          } transition-all duration-200`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {displayContent}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default function GenericListPage<T extends Record<string, unknown>>({
  title,
  apiEndpoint,
  breadcrumbsItems,
  columns,
  modal: ModalComponent,
  filters = [],
  extraButtons,
  idField = "_id",
  navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Activity Portal", href: "/activity-portal", active: true },
  ],
}: GenericListPageProps<T>) {
  const { data: session } = useSession();
  const [items, setItems] = useState<T[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      // Build query parameters including filters and search term
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      // Add all filter values
      Object.entries(filterValues)
        .filter(([, value]) => value)
        .forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });

      // Add search term if present
      if (searchTerm) {
        queryParams.append("query", searchTerm);
      }

      // Fetch items with pagination and filters
      const response = await fetchApi<ApiResponse<T>>(
        `${apiEndpoint}?${queryParams}`
      );

      if (
        !response ||
        typeof response !== "object" ||
        !("success" in response)
      ) {
        throw new Error("Invalid response format");
      }

      const typedResponse = response as ApiResponse<T>;

      if (!typedResponse.success) {
        throw new Error(typedResponse.message || "Failed to fetch items");
      }

      setItems(typedResponse.data || []);

      // Set total items from pagination data in the response
      if (typedResponse.pagination) {
        setTotalItems(typedResponse.pagination.total);
      } else {
        // Fallback to count endpoint if pagination is not in the response
        try {
          const countEndpoint = `${apiEndpoint}/count?${queryParams}`;
          const countResponse = await fetchApi<{ count: number }>(
            countEndpoint
          );

          if (
            countResponse &&
            typeof countResponse === "object" &&
            "count" in countResponse
          ) {
            setTotalItems(countResponse.count);
          } else {
            setTotalItems(0);
          }
        } catch (error) {
          console.error("Error fetching count:", error);
          setTotalItems(0);
        }
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Failed to fetch items");
      setItems([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterValues, apiEndpoint, searchTerm]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchItems();
    }
  }, [session, currentPage, itemsPerPage, filterValues, fetchItems]);

  const handleDelete = async (id: string) => {
    if (
      confirm(`Are you sure you want to delete this ${title.toLowerCase()}?`)
    ) {
      try {
        const formattedEndpoint = apiEndpoint.startsWith("http")
          ? apiEndpoint
          : apiEndpoint.startsWith("/")
          ? apiEndpoint
          : `/${apiEndpoint}`;

        const url = `${formattedEndpoint}?id=${id}`;

        const response = await fetchApi(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (
          !response ||
          typeof response !== "object" ||
          !("success" in response)
        ) {
          throw new Error("Invalid response format");
        }

        const typedResponse = response as ApiResponse<T>;

        if (!typedResponse.success) {
          throw new Error(typedResponse.message || "Failed to delete item");
        }

        await fetchItems();
        toast.success(`${title} deleted successfully`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";
        toast.error(errorMessage);
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues({
      ...filterValues,
      [key]: value,
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterValues({});
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate page range to display
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Adjust if we're near the end
  if (endPage - startPage + 1 < maxPageButtons && startPage > 1) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  // Render pagination only if there are multiple pages
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {startPage > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === 1
                        ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    1
                  </button>
                  {startPage > 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  )}
                </>
              )}

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === page
                      ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  }`}
                >
                  {page}
                </button>
              ))}

              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === totalPages
                        ? "z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        navItems={navItems}
        onSignOut={async () => {
          await signOut({ callbackUrl: "/signin" });
        }}
      />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbsItems.map((item, index) => (
                  <li key={index}>
                    {item.href ? (
                      <>
                        <Link
                          href={item.href}
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {item.label}
                        </Link>
                        <span className="mx-2 text-gray-300">/</span>
                      </>
                    ) : (
                      <span className="text-gray-900 font-medium">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                  {title}
                </h1>
                <p className="mt-1 text-gray-500">
                  Manage and organize your {title.toLowerCase()}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border-2 border-gray-200 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedItem(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-md text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add New
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="block w-full rounded-xl border-0 py-3.5 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 sm:text-sm sm:leading-6 shadow-sm hover:ring-blue-200"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none transition-colors"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                    Reset Filters
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filters.map((filter) => {
                    if (filter.type === "select" && filter.options) {
                      return (
                        <div key={String(filter.key)} className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {filter.label}
                          </label>
                          <select
                            className="block w-full rounded-xl border-gray-200 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm transition-all duration-200"
                            value={filterValues[String(filter.key)] || ""}
                            onChange={(e) =>
                              handleFilterChange(
                                String(filter.key),
                                e.target.value
                              )
                            }
                          >
                            <option value="">All {filter.label}s</option>
                            {filter.options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    } else {
                      return (
                        <div key={String(filter.key)} className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {filter.label}
                          </label>
                          <div className="relative">
                            <input
                              type={filter.type}
                              className="block w-full rounded-xl border-gray-200 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-8 transition-all duration-200"
                              value={filterValues[String(filter.key)] || ""}
                              onChange={(e) =>
                                handleFilterChange(
                                  String(filter.key),
                                  e.target.value
                                )
                              }
                              placeholder={`Filter by ${filter.label.toLowerCase()}`}
                            />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {columns.map((column) => (
                        <th
                          key={String(column.key)}
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                        >
                          <div className="flex items-center gap-2">
                            <span>{column.header}</span>
                          </div>
                        </th>
                      ))}
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 text-blue-600 mr-2"
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
                            Loading...
                          </div>
                        </td>
                      </tr>
                    ) : items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center py-6">
                            <svg
                              className="h-12 w-12 text-gray-400 mb-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 48 48"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13h30v24H9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 13l6-6h18l6 6M17 25h14"
                              />
                            </svg>
                            <p className="text-gray-500 text-base">
                              No items found
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr
                          key={String(item[idField])}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          {columns.map((column) => (
                            <td
                              key={String(column.key)}
                              className="px-6 py-4 text-sm text-gray-900"
                            >
                              <div className="max-w-xs">
                                {column.render ? (
                                  column.render(item)
                                ) : (
                                  <TableCell content={item[column.key]} />
                                )}
                              </div>
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                              >
                                <PencilIcon className="h-5 w-5" />
                                <span className="sr-only">Edit</span>
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(String(item[idField]))
                                }
                                className="text-red-600 hover:text-red-900 transition-colors duration-200"
                              >
                                <TrashIcon className="h-5 w-5" />
                                <span className="sr-only">Delete</span>
                              </button>
                              {extraButtons && extraButtons(item)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                {renderPagination()}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <ModalComponent
        isOpen={isModalOpen}
        onClose={(success) => {
          setIsModalOpen(false);
          if (success) {
            fetchItems();
          }
        }}
        item={selectedItem}
      />
    </div>
  );
}
