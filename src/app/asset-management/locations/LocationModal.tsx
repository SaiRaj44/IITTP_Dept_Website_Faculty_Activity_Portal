"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface LocationData {
  _id?: string;
  locationName: string;
  address: string;
  description: string;
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: LocationData | null;
  isViewMode?: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function LocationModal({
  isOpen,
  onClose,
  location,
  isViewMode,
}: LocationModalProps) {
  const [formData, setFormData] = useState<LocationData>({
    locationName: "",
    address: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (location) {
      setFormData({
        locationName: location.locationName,
        address: location.address,
        description: location.description,
      });
    } else {
      setFormData({
        locationName: "",
        address: "",
        description: "",
      });
    }
  }, [location]);

  const validateForm = () => {
    const errors: FormErrors = {};
    if (!formData.locationName.trim()) {
      errors.locationName = "Location name is required";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        location?._id ? `/api/locations/${location._id}` : "/api/locations",
        {
          method: location?._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={isViewMode ? onClose : () => {}}
      >
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
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {location
                        ? isViewMode
                          ? "View Location"
                          : "Edit Location"
                        : "Add Location"}
                    </Dialog.Title>

                    {error && (
                      <div className="mt-2 rounded-md bg-red-50 p-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                              {error}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="locationName"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location Name
                        </label>
                        <input
                          type="text"
                          name="locationName"
                          id="locationName"
                          value={formData.locationName}
                          onChange={handleChange}
                          disabled={isViewMode}
                          className={`mt-1 block w-full rounded-md ${
                            isViewMode ? "bg-gray-100" : "bg-white"
                          } border-gray-300 shadow-sm focus:border-indigo-500 text-black focus:ring-indigo-500 sm:text-sm`}
                        />
                        {touched.locationName && formErrors.locationName && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.locationName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={isViewMode}
                          className={`mt-1 block w-full rounded-md ${
                            isViewMode ? "bg-gray-100" : "bg-white"
                          } border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                        />
                        {touched.address && formErrors.address && (
                          <p className="mt-2 text-sm text-red-600">
                            {formErrors.address}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          disabled={isViewMode}
                          className={`mt-1 block w-full rounded-md ${
                            isViewMode ? "bg-gray-100" : "bg-white"
                          } border-gray-300 shadow-sm text-black focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                        />
                      </div>

                      {!isViewMode && (
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                          >
                            {loading
                              ? "Saving..."
                              : location
                              ? "Update Location"
                              : "Add Location"}
                          </button>
                          <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
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
