"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { get, set } from "lodash"; // Import get and set from lodash

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  maxLength?: number;
  rows?: number;
}

interface GenericModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  item?: Record<string, unknown> | null;
  fields: Field[];
  apiEndpoint: string;
  onSuccess?: () => void;
  customSubmit?: (data: Record<string, unknown>) => Promise<unknown>;
}

export const GenericModal = ({
  title,
  isOpen,
  onClose,
  item,
  fields,
  apiEndpoint,
  onSuccess,
  customSubmit,
}: GenericModalProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with item data or empty values
  useEffect(() => {
    const initialData: Record<string, unknown> = {};
    fields.forEach((field) => {
      if (item && field.name.includes(".")) {
        // Handle nested fields
        initialData[field.name] = get(item, field.name); // Use get from lodash
      } else if (item && field.name in item) {
        initialData[field.name] = item[field.name];
      } else {
        // Set default values based on field type
        if (field.type === "checkbox") {
          initialData[field.name] = false;
        } else if (field.type === "number") {
          initialData[field.name] = 0;
        } else {
          initialData[field.name] = "";
        }
      }
    });
    setFormData(initialData);
    setErrors({});
  }, [item, fields, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = field.name.includes(".")
        ? get(formData, field.name)
        : formData[field.name];

      if (
        field.required &&
        (value === undefined || value === null || value === "")
      ) {
        newErrors[field.name] = `${field.label} is required`;
      }

      if (
        field.type === "number" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newErrors[field.name] = `${field.label} must be a number`;
        } else {
          if (field.min !== undefined && numValue < field.min) {
            newErrors[
              field.name
            ] = `${field.label} must be at least ${field.min}`;
          }
          if (field.max !== undefined && numValue > field.max) {
            newErrors[
              field.name
            ] = `${field.label} must be at most ${field.max}`;
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type } = e.target;
    let value: unknown;

    if (type === "checkbox") {
      value = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      value = e.target.value === "" ? "" : Number(e.target.value);
    } else {
      value = e.target.value;
    }

    if (name.includes(".")) {
      // Handle nested fields
      const newFormData = { ...formData };
      set(newFormData, name, value);
      setFormData(newFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (customSubmit) {
        // Use custom submit handler if provided
        response = await customSubmit(formData as Record<string, unknown>);
      } else {
        // Prepare the data by converting dot notation keys to nested objects
        const preparedData: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(formData)) {
          if (key.includes(".")) {
            set(preparedData, key, value);
          } else {
            preparedData[key] = value;
          }
        }

        // Add ID for updates
        if (item?._id) {
          preparedData.id = item._id;
        }

        // Send request to API
        response = await fetch(apiEndpoint, {
          method: item?._id ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(preparedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Something went wrong");
        }
      }

      toast.success(
        item?._id ? "Item updated successfully" : "Item created successfully"
      );
      onClose();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      // Updated type
      let errorMessage = "Something went wrong";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: Field) => {
    const fieldName = field.name;
    let fieldValue = fieldName.includes(".")
      ? get(formData, fieldName)
      : formData[fieldName];

    // Handle undefined or null values
    if (fieldValue === undefined || fieldValue === null) {
      if (field.type === "checkbox") {
        fieldValue = false;
      } else if (field.type === "number") {
        fieldValue = "";
      } else {
        fieldValue = "";
      }
    }

    // Cast fieldValue to the appropriate type for input, textarea, and select
    const inputValue = fieldValue as
      | string
      | number
      | readonly string[]
      | undefined;

    const fieldError = errors[fieldName];

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "date":
      case "number":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={fieldName}
              name={fieldName}
              value={inputValue}
              onChange={handleChange}
              min={field.min}
              max={field.max}
              step={field.step}
              required={field.required}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              className={`block w-full rounded-md border ${
                fieldError ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id={fieldName}
              name={fieldName}
              value={inputValue as string} // Cast to string for textarea
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className={`block w-full rounded-md border ${
                fieldError ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <select
              id={fieldName}
              name={fieldName}
              value={inputValue as string} // Cast to string for select
              onChange={handleChange}
              required={field.required}
              className={`block w-full rounded-md border ${
                fieldError ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={fieldName} className="mb-4 flex items-center">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={!!fieldValue}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor={fieldName}
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div key={fieldName} className="mb-4">
            <label
              htmlFor={fieldName}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id={fieldName}
              name={fieldName}
              onChange={handleChange}
              required={field.required}
              accept={field.accept}
              className={`block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:py-2 file:px-4 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none`}
            />
            {fieldError && (
              <p className="mt-1 text-sm text-red-600">{fieldError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
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
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {item?._id ? `Edit ${title}` : `Create ${title}`}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          {fields.map((field) => renderField(field))}
                        </div>
                        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-indigo-300"
                          >
                            {isSubmitting ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                Saving...
                              </span>
                            ) : item?._id ? (
                              "Update"
                            ) : (
                              "Create"
                            )}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
