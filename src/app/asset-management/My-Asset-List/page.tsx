"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import AssetModal from "../All-Assets/AssetModal";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import { assetCategories, IAsset } from "@/app/types/asset.types";

// Use IAsset directly from asset.types.ts

export default function AssetsPage() {
  const { data: session } = useSession();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const [locations, setLocations] = useState<
    { _id: string; locationName: string; address: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<IAsset | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    location: "",
    status: "",
    category: "",
    subcategory: "",
    search: "",
  });
  const [isViewMode, setIsViewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/assets");
      if (!response.ok) {
        throw new Error("Failed to fetch assets");
      }
      const data = await response.json();
      if (data.success) {
        const filteredAssets = data.data.filter(
          (asset: IAsset) => asset.createdBy === session?.user.email
        );
        setAssets(filteredAssets);
      } else {
        setError(data.error || "Failed to fetch assets");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user.email]);

  const fetchLocations = useCallback(async () => {
    try {
      const response = await fetch("/api/locations");
      const data = await response.json();
      if (data.success) {
        setLocations(data.data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchLocations();
  }, [fetchAssets, fetchLocations]);

  const handleEdit = (asset: IAsset) => {
    setSelectedAsset(asset);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        const response = await fetch(`/api/assets?id=${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          fetchAssets();
        }
      } catch (error) {
        console.error("Error deleting asset:", error);
      }
    }
  };

  const handleView = (asset: IAsset) => {
    setSelectedAsset(asset);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    fetchAssets();
  };

  const filteredAssets = assets.filter((asset: IAsset) => {
    const matchesLocation =
      !filters.location || (asset.locationId && asset.locationId._id === filters.location);
    const matchesStatus = !filters.status || asset.status === filters.status;
    const matchesCategory =
      !filters.category || asset.category === filters.category;
    const matchesSubcategory =
      !filters.subcategory || asset.subcategory === filters.subcategory;
    const matchesSearch =
      !filters.search ||
      asset.assetName.toLowerCase().includes(filters.search.toLowerCase()) ||
      asset.assetId.toLowerCase().includes(filters.search.toLowerCase()) ||
      asset.brand.toLowerCase().includes(filters.search.toLowerCase());

    return matchesLocation && matchesStatus && matchesCategory && matchesSubcategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const maxVisiblePages = 10;
  const getPageItems = () => {
    const items: (number | string)[] = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }

    const sidePages = 2; // always show first & last and a small buffer
    const windowSize = maxVisiblePages - (sidePages * 2 + 2); // reserve spots for edges and 2 ellipses
    const halfWindow = Math.floor(windowSize / 2);

    let left = Math.max(2, currentPage - halfWindow);
    let right = Math.min(totalPages - 1, currentPage + halfWindow);

    // adjust window if it's clipped at one end
    if (currentPage - left < halfWindow) {
      right = Math.min(totalPages - 1, right + (halfWindow - (currentPage - left)));
    }
    if (right - currentPage < halfWindow) {
      left = Math.max(2, left - (halfWindow - (right - currentPage)));
    }

    items.push(1);
    if (left > 2) items.push("left-ellipsis");

    for (let i = left; i <= right; i++) items.push(i);

    if (right < totalPages - 1) items.push("right-ellipsis");
    items.push(totalPages);

    return items;
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets
    .slice(startIndex, startIndex + itemsPerPage)
    .sort((a, b) => a.assetId.localeCompare(b.assetId));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "In Repair":
        return "bg-yellow-100 text-yellow-800";
      case "Disposed":
        return "bg-red-100 text-red-800";
      case "Lost":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading assets
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchAssets}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 text-sm">
      <Breadcrumbs />
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900 mt-2 ml-2">
            Assets List
          </h1>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="h-5 w-5 inline-block mr-1" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700"
            >
              Search
            </label>
            <input
              type="text"
              name="search"
              id="search"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search assets..."
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <select
              id="location"
              name="location"
              value={filters.location}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, location: e.target.value }))
              }
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Locations</option>
              {locations
                .sort((a, b) => a.address.localeCompare(b.address))
                .map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.address}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
              <option value="Disposed">Disposed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {Object.keys(assetCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-700"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={filters.subcategory}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, subcategory: e.target.value }))
              }
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">All Subcategories</option>
              {filters.category && assetCategories[filters.category as keyof typeof assetCategories]?.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              {!filters.category && Object.values(assetCategories).flat().map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Asset ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Custodian
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Serial Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Warranty Expiry
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="text-sm font-semibold text-gray-900">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {paginatedAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {asset.assetId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">
                          {asset.assetName}
                        </div>
                        <div className="text-gray-500">{asset.brand}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="font-medium text-gray-900">
                          {asset.category}
                        </div>
                        <div className="text-gray-500">{asset.subcategory}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {asset.locationId ? asset.locationId.address : 'No location'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {asset.custodian || "Unassigned"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {asset.serialNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(
                          asset.warrantyExpiryDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(
                            asset.status
                          )}`}
                        >
                          {asset.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-6 px-3 text-sm font-medium sm:pr-6 flex justify-center items-center space-x-3">
                        <button
                          onClick={() => handleView(asset)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>

                        {asset.createdBy === session?.user?.email && (
                          <>
                            <button
                              onClick={() => handleEdit(asset)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(asset._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredAssets.length)}
              </span>{" "}
              of <span className="font-medium">{filteredAssets.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Previous
              </button>
              {getPageItems().map((item, idx) => {
                if (item === "left-ellipsis" || item === "right-ellipsis") {
                  return (
                    <span
                      key={`e-${idx}`}
                      className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700"
                    >
                      …
                    </span>
                  );
                }

                const pageNum = Number(item);
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === pageNum
                      ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        asset={selectedAsset}
        isViewMode={isViewMode}
      />
    </div>
  );
}
