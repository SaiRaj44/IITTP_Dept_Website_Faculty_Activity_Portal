"use client";

import React, { useState, useEffect } from "react";
import ScholarCard from "./ScholarCard";
import { useSearchParams } from "next/navigation";
import { FunnelIcon, MagnifyingGlassIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface Scholar {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  year: string;
  batch: string;
  guide: string;
  guide_profileUrl?: string;
  domain: string;
  email: string;
}

interface ScholarGridProps {
  initialScholars?: Scholar[];
  allowFiltering?: boolean;
}

export default function ScholarGrid({
  initialScholars = [],
  allowFiltering = true,
}: ScholarGridProps) {
  const [scholars, setScholars] = useState<Scholar[]>(initialScholars);
  const [loading, setLoading] = useState(initialScholars.length === 0);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const yearParam = searchParams.get("year");

  useEffect(() => {
    if (categoryParam) {
      setFilter(categoryParam);
    }
    
    if (yearParam) {
      setYearFilter(yearParam);
    }
  }, [categoryParam, yearParam]);

  useEffect(() => {
    const fetchScholars = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/public/scholar-information");
        if (!response.ok) throw new Error("Failed to fetch scholar data");
        
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setScholars(data.data as Scholar[]);
          
          // Extract unique years for filtering
          const scholarYears: string[] = [];
          data.data.forEach((scholar: Scholar) => {
            if (scholar.year && !scholarYears.includes(scholar.year)) {
              scholarYears.push(scholar.year);
            }
          });
          
          // Sort years in descending order
          setAvailableYears(
            scholarYears.sort((a, b) => parseInt(b) - parseInt(a))
          );
        }
      } catch (error) {
        console.error("Error fetching scholars:", error);
      } finally {
        setLoading(false);
      }
    };

    if (initialScholars.length === 0) {
      fetchScholars();
    } else {
      // Extract unique years from the provided scholars
      const years = [...new Set(initialScholars.map(scholar => scholar.year))];
      setAvailableYears(years.sort((a, b) => parseInt(b) - parseInt(a)));
    }
  }, [initialScholars]);

  // Filter scholars based on category, search term, and year
  const filteredScholars = scholars.filter((scholar) => {
    const matchesCategory = filter === "all" || scholar.category === filter;
    const matchesYear = yearFilter === "all" || scholar.year === yearFilter;
    
    const matchesSearch = searchTerm === "" || 
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.guide.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch && matchesYear;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allowFiltering && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-grow lg:max-w-md">
              <div className="relative rounded-lg border border-gray-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border-0 rounded-lg focus:ring-0 focus:outline-none text-sm"
                  placeholder="Search by name, domain, or guide..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    id="category-filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="PhD Regular">PhD Regular</option>
                    <option value="PhD External">PhD External</option>
                    <option value="MS Regular">MS Regular</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Year Filter */}
              <div className="relative">
                <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <div className="relative">
                  <select
                    id="year-filter"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                    <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredScholars.length} {filteredScholars.length === 1 ? "scholar" : "scholars"}
          </div>
        </div>
      )}

      {filteredScholars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholars.map((scholar) => (
            <ScholarCard
              key={scholar._id}
              name={scholar.name}
              category={scholar.category}
              imageUrl={scholar.imageUrl}
              year={scholar.year}
              batch={scholar.batch}
              guide={scholar.guide}
              guide_profileUrl={scholar.guide_profileUrl}
              domain={scholar.domain}
              email={scholar.email}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FunnelIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No scholars found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find what you&apos;re looking for.
          </p>
        </div>
      )}
    </div>
  );
} 