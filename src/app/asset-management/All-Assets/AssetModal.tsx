"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  IAsset,
  IAssetFormData,
  assetCategories,
  AssetCategory,
} from "@/app/types/asset.types";

interface Vendor {
  _id: string;
  vendorName: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
}

interface Location {
  _id: string;
  locationName: string;
  address?: string;
  description?: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function AssetModal({
  isOpen,
  onClose,
  asset,
  isViewMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  asset?: IAsset | null;
  isViewMode?: boolean;
}) {
  const [formData, setFormData] = useState<IAssetFormData>({
    _id: "",
    assetName: "",
    assetId: "",
    category: "" as AssetCategory,
    subcategory: "",
    brand: "",
    serialNumber: "",
    purchaseNumber: "",
    source: "Project Fund",
    purchaseDate: "",
    purchasePrice: 0,
    vendorId: "",
    warrantyPeriod: {
      years: 0,
      months: 0,
    },
    warrantyExpiryDate: "",
    currentCondition: "Excellent",
    createdBy: "",
    createdAt: "",
    updatedAt: "",
    locationId: "",
    status: "Active",
    attachment: null,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [hoveredItem, setHoveredItem] = useState<{
    type: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    if (asset) {
      setFormData({
        ...asset,
        purchaseDate: asset.purchaseDate.split("T")[0],
        vendorId: asset.vendorId ? asset.vendorId._id : "",
        locationId: asset.locationId ? asset.locationId._id : "",
        attachment: null,
      });
      setSelectedFile(null);
    } else {
      setFormData({
        _id: "",
        assetName: "",
        assetId: "",
        category: "" as AssetCategory,
        subcategory: "",
        brand: "",
        serialNumber: "",
        purchaseNumber: "",
        source: "Project Fund",
        purchaseDate: "",
        purchasePrice: 0,
        vendorId: "",
        warrantyPeriod: {
          years: 0,
          months: 0,
        },
        warrantyExpiryDate: "",
        currentCondition: "Excellent",
        createdBy: "",
        createdAt: "",
        updatedAt: "",
        locationId: "",
        status: "Active",
        attachment: null,
      });
    }
    setFormErrors({});
    setTouched({});
  }, [asset]);

  useEffect(() => {
    const fetchVendorsAndLocations = async () => {
      try {
        const [vendorsRes, locationsRes] = await Promise.all([
          fetch("/api/vendors"),
          fetch("/api/locations"),
        ]);

        const vendorsData = await vendorsRes.json();
        const locationsData = await locationsRes.json();

        if (vendorsData.success) {
          setVendors(vendorsData.data);
        }
        if (locationsData.success) {
          setLocations(locationsData.data);
        }
      } catch (error) {
        console.error("Error fetching vendors and locations:", error);
        setError("Failed to load vendors and locations");
      }
    };

    if (isOpen) {
      fetchVendorsAndLocations();
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        attachment: file,
      }));
    }
  };

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case "category":
        return !value ? "Category is required" : "";
      case "subcategory":
        return !value ? "Subcategory is required" : "";
      case "assetName":
        return !value.toString().trim() ? "Asset name is required" : "";
      case "brand":
        return !value.toString().trim() ? "Brand is required" : "";
      case "serialNumber":
        return !value.toString().trim() ? "Serial number is required" : "";
      case "purchaseDate":
        return !value ? "Purchase date is required" : "";
      case "purchasePrice":
        return Number(value) < 0 ? "Purchase price must be positive" : "";
      case "vendorId":
        return !value ? "Vendor is required" : "";
      case "locationId":
        return !value ? "Location is required" : "";
      case "currentCondition":
        return !value ? "Current condition is required" : "";
      case "status":
        return !value ? "Status is required" : "";
      case "warrantyPeriod.years":
        return Number(value) < 0 ? "Years must be positive" : "";
      case "warrantyPeriod.months":
        return Number(value) < 0 || Number(value) > 11
          ? "Months must be between 0 and 11"
          : "";
      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "warrantyPeriod") {
        const yearError = validateField("warrantyPeriod.years", value.years);
        const monthError = validateField("warrantyPeriod.months", value.months);
        if (yearError) {
          errors["warrantyPeriod.years"] = yearError;
          isValid = false;
        }
        if (monthError) {
          errors["warrantyPeriod.months"] = monthError;
          isValid = false;
        }
      } else {
        const error = validateField(key, value as string | number);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    let { value } = e.target;

    // Convert specific fields to uppercase
    if (name === "serialNumber" || name === "purchaseNumber") {
      value = value.toUpperCase();
    }

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const newValue =
        child === "months"
          ? Math.min(Math.max(0, parseInt(value) || 0), 11)
          : parseInt(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: newValue,
        },
      }));
    } else if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value as AssetCategory,
        subcategory: "",
      }));
    } else if (name === "purchasePrice") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const newTouched: { [key: string]: boolean } = {};
    Object.keys(formData).forEach((key) => {
      newTouched[key] = true;
    });
    newTouched["warrantyPeriod.years"] = true;
    newTouched["warrantyPeriod.months"] = true;
    setTouched(newTouched);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      if (asset?._id) {
        formDataToSend.append("_id", asset._id);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "warrantyPeriod") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === "purchasePrice") {
          formDataToSend.append(key, String(value));
        } else if (key === "attachment") {
          return;
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      if (selectedFile) {
        formDataToSend.append("attachment", selectedFile);
      }

      const response = await fetch("/api/assets", {
        method: asset ? "PUT" : "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        onClose();
      } else {
        setError(data.error || "Failed to save asset");
      }
    } catch (err) {
      console.error("Error saving asset:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save asset. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (name: string): string => {
    return touched[name] ? formErrors[name] || "" : "";
  };

  const renderAttachments = () => {
    if (isViewMode) {
      if (asset?.attachments && asset.attachments.length > 0) {
        return (
          <div className="mt-2">
            {asset.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {attachment.name}
              </a>
            ))}
          </div>
        );
      }
      return <p className="text-gray-500 mt-2">No attachments</p>;
    }

    return (
      <div className="mt-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {selectedFile && (
          <p className="text-sm text-gray-600 mt-1">
            Selected file: {selectedFile.name}
          </p>
        )}
      </div>
    );
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900 border-b pb-4 mb-4"
                    >
                      {isViewMode
                        ? `Asset Details :: ${asset?.purchaseNumber || ""}`
                        : asset
                        ? "Edit Asset"
                        : "Add New Asset"}
                    </Dialog.Title>

                    {error && (
                      <div className="mt-2 rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                      </div>
                    )}

                    {isViewMode ? (
                      <div className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Category
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.category}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Subcategory
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.subcategory}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Asset Name/Model
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.assetName}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Brand/Manufacturer
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.brand}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Serial Number
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.serialNumber}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Purchase Date
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(
                                asset?.purchaseDate || ""
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Fund Source
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.source}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Purchase Price
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              ₹{asset?.purchasePrice}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Vendor
                            </h4>
                            <p
                              className="mt-1 text-sm text-gray-900 cursor-help"
                              onMouseEnter={() =>
                                setHoveredItem({
                                  type: "vendor",
                                  id: asset?.vendorId._id || "",
                                })
                              }
                              onMouseLeave={() => setHoveredItem(null)}
                            >
                              {asset?.vendorId.vendorName}
                              {hoveredItem?.type === "vendor" &&
                                hoveredItem.id === asset?.vendorId._id && (
                                  <div className="absolute z-10 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                                    <p>
                                      {
                                        vendors.find(
                                          (v) => v._id === asset?.vendorId._id
                                        )?.description
                                      }
                                    </p>
                                    <p>
                                      {
                                        vendors.find(
                                          (v) => v._id === asset?.vendorId._id
                                        )?.address
                                      }
                                    </p>
                                    <p>
                                      {
                                        vendors.find(
                                          (v) => v._id === asset?.vendorId._id
                                        )?.phone
                                      }
                                    </p>
                                    <p>
                                      {
                                        vendors.find(
                                          (v) => v._id === asset?.vendorId._id
                                        )?.email
                                      }
                                    </p>
                                  </div>
                                )}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Warranty Period
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.warrantyPeriod.years} years,{" "}
                              {asset?.warrantyPeriod.months} months
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Location
                            </h4>
                            <p
                              className="mt-1 text-sm text-gray-900 cursor-help"
                              onMouseEnter={() =>
                                setHoveredItem({
                                  type: "location",
                                  id: asset?.locationId._id || "",
                                })
                              }
                              onMouseLeave={() => setHoveredItem(null)}
                            >
                              {asset?.locationId.address}
                              {hoveredItem?.type === "location" &&
                                hoveredItem.id === asset?.locationId._id && (
                                  <div className="absolute z-10 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                                    <p>
                                      {
                                        locations.find(
                                          (l) => l._id === asset?.locationId._id
                                        )?.locationName
                                      }
                                    </p>
                                    <p>
                                      {
                                        locations.find(
                                          (l) => l._id === asset?.locationId._id
                                        )?.description
                                      }
                                    </p>
                                  </div>
                                )}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Current Condition
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.currentCondition}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Status
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.status}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Custodian == Assigned To
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.custodian || "Unassigned"} =={" "}
                              {asset?.assginedTo || "Unassigned"}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Mode of Allotment
                            </h4>
                            <p className="mt-1 text-sm text-gray-900">
                              {asset?.allotMode}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">
                              Attachment
                            </h4>
                            {renderAttachments()}
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            type="button"
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={onClose}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="category"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Category
                            </label>
                            <select
                              name="category"
                              id="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  category: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("category")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            >
                              <option value="">Select Category</option>
                              {(
                                Object.keys(assetCategories) as AssetCategory[]
                              ).map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                            {getFieldError("category") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("category")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="subcategory"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Subcategory
                            </label>
                            <select
                              name="subcategory"
                              id="subcategory"
                              value={formData.subcategory}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  subcategory: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("subcategory")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                              disabled={!formData.category}
                            >
                              <option value="">Select Subcategory</option>
                              {formData.category &&
                                assetCategories[formData.category].map(
                                  (sub) => (
                                    <option key={sub} value={sub}>
                                      {sub}
                                    </option>
                                  )
                                )}
                            </select>
                            {getFieldError("subcategory") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("subcategory")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="assetName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Asset Name/Model
                            </label>
                            <input
                              type="text"
                              name="assetName"
                              id="assetName"
                              value={formData.assetName}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  assetName: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("assetName")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            />
                            {getFieldError("assetName") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("assetName")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="brand"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Brand/Manufacturer
                            </label>
                            <input
                              type="text"
                              name="brand"
                              id="brand"
                              value={formData.brand}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({ ...prev, brand: true }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("brand")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            />
                            {getFieldError("brand") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("brand")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="serialNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Serial Number
                            </label>
                            <input
                              type="text"
                              name="serialNumber"
                              id="serialNumber"
                              value={formData.serialNumber}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  serialNumber: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("serialNumber")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            />
                            {getFieldError("serialNumber") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("serialNumber")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="purchaseNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Purchase Number
                            </label>
                            <input
                              type="text"
                              name="purchaseNumber"
                              id="purchaseNumber"
                              value={formData.purchaseNumber}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  purchaseNumber: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("purchaseNumber")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            />
                            {getFieldError("purchaseNumber") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("purchaseNumber")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="source"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Source
                            </label>
                            <select
                              name="source"
                              id="source"
                              value={formData.source}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  source: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("source")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            >
                              <option value="Institute Fund">
                                Institute Fund
                              </option>
                              <option value="Department Budget">
                                Department Budget
                              </option>
                              <option value="Project Fund">Project fund</option>
                              <option value="CPDA">CPDA</option>
                              <option value="NFSUG">NFSUG</option>
                              <option value="NFG">NFG</option>
                              <option value="Others">Others</option>
                            </select>
                            {getFieldError("source") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("source")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="purchaseDate"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Purchase Date
                            </label>
                            <input
                              type="date"
                              name="purchaseDate"
                              id="purchaseDate"
                              value={formData.purchaseDate}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  purchaseDate: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("purchaseDate")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            />
                            {getFieldError("purchaseDate") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("purchaseDate")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="purchasePrice"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Purchase Price
                            </label>
                            <input
                              type="number"
                              name="purchasePrice"
                              id="purchasePrice"
                              value={formData.purchasePrice}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  purchasePrice: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("purchasePrice")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                              min="0"
                              step="0.01"
                            />
                            {getFieldError("purchasePrice") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("purchasePrice")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="vendorId"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Vendor
                            </label>
                            <select
                              name="vendorId"
                              id="vendorId"
                              value={formData.vendorId}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  vendorId: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("vendorId")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            >
                              <option value="">Select Vendor</option>
                              {vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                  {vendor.vendorName}
                                </option>
                              ))}
                            </select>
                            {getFieldError("vendorId") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("vendorId")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="warrantyPeriod.years"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Warranty Period (Years)
                            </label>
                            <input
                              type="number"
                              name="warrantyPeriod.years"
                              id="warrantyPeriod.years"
                              value={formData.warrantyPeriod.years}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  "warrantyPeriod.years": true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("warrantyPeriod.years")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              min="0"
                            />
                            {getFieldError("warrantyPeriod.years") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("warrantyPeriod.years")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="warrantyPeriod.months"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Warranty Period (Months)
                            </label>
                            <input
                              type="number"
                              name="warrantyPeriod.months"
                              id="warrantyPeriod.months"
                              value={formData.warrantyPeriod.months}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  "warrantyPeriod.months": true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("warrantyPeriod.months")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              min="0"
                              max="11"
                            />
                            {getFieldError("warrantyPeriod.months") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("warrantyPeriod.months")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="currentCondition"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Current Condition
                            </label>
                            <select
                              name="currentCondition"
                              id="currentCondition"
                              value={formData.currentCondition}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  currentCondition: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("currentCondition")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            >
                              <option value="">Select Condition</option>
                              <option value="Excellent">Excellent</option>
                              <option value="Good">Good</option>
                              <option value="Fair">Fair</option>
                              <option value="Poor">Poor</option>
                              <option value="NeedsRepair">Needs Repair</option>
                            </select>
                            {getFieldError("currentCondition") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("currentCondition")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Status
                            </label>
                            <select
                              name="status"
                              id="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  status: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("status")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            >
                              <option value="">Select Status</option>
                              <option value="Active">Active</option>
                              <option value="In Repair">In Repair</option>
                              <option value="Disposed">Disposed</option>
                              <option value="Lost">Lost</option>
                            </select>
                            {getFieldError("status") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("status")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="custodian"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Custodian
                            </label>
                            <input
                              type="text"
                              name="custodian"
                              id="custodian"
                              value={formData.custodian || ""}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  custodian: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("custodian")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            />
                            {getFieldError("custodian") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("custodian")}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="assginedTo"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Assigned To
                            </label>
                            <input
                              type="text"
                              name="assginedTo"
                              id="assginedTo"
                              value={formData.assginedTo || ""}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  assginedTo: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("assginedTo")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            />
                            {getFieldError("assginedTo") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("assginedTo")}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor="locationId"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Location
                            </label>
                            <select
                              name="locationId"
                              id="locationId"
                              value={formData.locationId}
                              onChange={handleInputChange}
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  locationId: true,
                                }))
                              }
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("locationId")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                              required
                            >
                              <option value="">Select Location</option>
                              {locations
                                .sort((a, b) =>
                                  (a.address || "").localeCompare(b.address || "")
                                )
                                .map((location) => (
                                  <option
                                    key={location._id}
                                    value={location._id}
                                  >
                                    {location.address}
                                  </option>
                                ))}
                            </select>
                            {getFieldError("locationId") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("locationId")}
                              </p>
                            )}
                          </div>

                          <div>
                            {asset &&
                              asset.attachments &&
                              asset.attachments.length > 0 && (
                                <div className="mt-2">
                                  <h4 className="font-medium text-gray-900">
                                    Previous Attachments:
                                  </h4>
                                  {asset.attachments.map(
                                    (attachment, index) => (
                                      <a
                                        key={index}
                                        href={attachment.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                      >
                                        {attachment.name}
                                      </a>
                                    )
                                  )}
                                </div>
                              )}

                            <input
                              type="file"
                              onChange={handleFileChange}
                              name="attachment"
                              id="attachment"
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="remarks"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Remarks
                            </label>
                            <textarea
                              name="remarks"
                              id="remarks"
                              value={formData.remarks || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  remarks: e.target.value,
                                })
                              }
                              onBlur={() =>
                                setTouched((prev) => ({
                                  ...prev,
                                  remarks: true,
                                }))
                              }
                              rows={3}
                              className={`mt-1 block w-full rounded-md text-black shadow-sm sm:text-sm ${
                                getFieldError("remarks")
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              }`}
                            />
                            {getFieldError("remarks") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("remarks")}
                              </p>
                            )}
                          </div>

                          <div className="flex justify-end space-x-3 mt-6 col-span-2">
                            <button
                              type="button"
                              onClick={onClose}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={loading}
                              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading
                                  ? "bg-blue-400 cursor-not-allowed"
                                  : "bg-blue-500 hover:bg-blue-600"
                              }`}
                            >
                              {loading
                                ? "Saving..."
                                : asset
                                ? "Update Asset"
                                : "Add Asset"}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
