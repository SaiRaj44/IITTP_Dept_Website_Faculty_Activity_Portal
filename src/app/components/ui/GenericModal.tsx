"use client";

import { Fragment, useState, useEffect, ReactNode } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import ArrayField, { Member } from "./ArrayField";

interface BaseItem {
  _id?: string;
  createdBy: string;
  published: boolean;
}

interface GenericModalProps<T extends BaseItem> {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: T | null;
  title: string;
  apiEndpoint: string;
  fields: Field<T>[];
  renderCustomFields?: (
    formData: Partial<T>,
    setFormData: React.Dispatch<React.SetStateAction<Partial<T>>>
  ) => ReactNode;
  validate?: (formData: Partial<T>) => string | null;
}

interface ArrayFieldConfig {
  component: React.ComponentType<{
    items: Member[];
    onAdd: (item: Member) => void;
    onRemove: (index: number) => void;
    itemLabel: string;
  }>;
  initialItem: Member;
  minItems?: number;
}

export interface Field<T> {
  name: keyof T;
  label: string;
  type:
    | "text"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "textarea"
    | "array";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
  arrayConfig?: ArrayFieldConfig;
}

export default function GenericModal<T extends BaseItem>({
  isOpen,
  onClose,
  item,
  title,
  apiEndpoint,
  fields,
  renderCustomFields,
  validate,
}: GenericModalProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Generate a unique key for this form in localStorage
  const storageKey = `${apiEndpoint.replace(/\//g, '_')}_form_data`;

  // Load initial data either from item prop or from localStorage
  useEffect(() => {
    if (item) {
      // Editing existing item - use item data
      const initialData: Partial<T> = {};

      fields.forEach((field) => {
        const value = item[field.name];
        if (field.type === "date") {
          if (value instanceof Date) {
            initialData[field.name] = value.toISOString().split("T")[0] as T[keyof T];
          } else if (typeof value === "string" && value) {
            // Handle string dates from the API
            const dateValue = new Date(value);
            initialData[field.name] = dateValue.toISOString().split("T")[0] as T[keyof T];
          } else {
            initialData[field.name] = value as T[keyof T];
          }
        } else if (field.type === "number" && typeof value === "number") {
          initialData[field.name] = value as T[keyof T];
        } else {
          initialData[field.name] = value as T[keyof T];
        }
      });

      // Ensure published field is always included with default value false for existing items
      if (!fields.some(field => field.name === 'published')) {
        initialData['published' as keyof T] = (item?.published ?? false) as unknown as T[keyof T];
      }

      setFormData(initialData);
    } else {
      // Creating new item - ALWAYS initialize with empty values, NOT from localStorage
      // Clear any previous form data from localStorage when opening a new form
      localStorage.removeItem(storageKey);
      
      const initialData: Partial<T> = {};
      fields.forEach((field) => {
        if (field.type === "array") {
          initialData[field.name] = [] as unknown as T[keyof T];
        } else if (field.type === "checkbox") {
          initialData[field.name] = false as unknown as T[keyof T];
        } else {
          initialData[field.name] = "" as unknown as T[keyof T];
        }
      });
      
      // Ensure published field is always included with default value false
      if (!fields.some(field => field.name === 'published')) {
        initialData['published' as keyof T] = false as unknown as T[keyof T];
      }
      
      setFormData(initialData);
    }

    setErrors({});
  }, [item, fields, isOpen, storageKey]);

  // Save form data to localStorage when it changes (but only for existing forms being edited)
  useEffect(() => {
    if (Object.keys(formData).length > 0 && item) {
      localStorage.setItem(storageKey, JSON.stringify(formData));
    }
  }, [formData, storageKey, item]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const key = name as keyof T;
    
    const newValue = type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : type === "number"
      ? value === ""
        ? ""
        : Number(value)
      : value;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [key]: newValue,
      };
      
      // Save to localStorage
      localStorage.setItem(storageKey, JSON.stringify(updated));
      
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleArrayAdd = (fieldName: keyof T, item: Member) => {
    setFormData((prev) => {
      const currentArray = (prev[fieldName] as Member[] | undefined) || [];
      return {
        ...prev,
        [fieldName]: [...currentArray, item] as T[keyof T],
      };
    });
  };

  const handleArrayRemove = (fieldName: keyof T, index: number) => {
    setFormData((prev) => {
      const currentArray = (prev[fieldName] as Member[] | undefined) || [];
      return {
        ...prev,
        [fieldName]: currentArray.filter((_, i) => i !== index) as T[keyof T],
      };
    });
  };

  const resetForm = () => {
    if (item) {
      const initialData: Partial<T> = {};
      fields.forEach((field) => {
        initialData[field.name] = item[field.name];
      });
      setFormData(initialData);
    } else {
      const initialData: Partial<T> = {};
      fields.forEach((field) => {
        initialData[field.name] = (field.type === "array"
          ? []
          : field.type === "checkbox"
          ? false
          : "") as unknown as T[keyof T];
      });
      setFormData(initialData);
    }
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (validate) {
      const errorMessage = validate(formData);
      if (errorMessage) {
        toast.error(errorMessage);
        return false;
      }
    }

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];
        if (
          field.type === "array" &&
          (!value || (value as unknown[]).length === 0)
        ) {
          newErrors[field.name as string] = `${field.label} is required`;
          isValid = false;
        } else if (
          field.type !== "array" &&
          (value === undefined || value === null || value === "")
        ) {
          newErrors[field.name as string] = `${field.label} is required`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      // Format URL properly
      const formattedEndpoint = apiEndpoint.startsWith("http")
        ? apiEndpoint
        : apiEndpoint.startsWith("/")
        ? apiEndpoint
        : `/${apiEndpoint}`;

      // Add id to URL if updating
      const url = item?._id
        ? `${formattedEndpoint}?id=${item._id}`
        : formattedEndpoint;

      const method = item?._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      toast.success(`${title} ${item?._id ? "updated" : "created"} successfully`);
      
      // Clear localStorage data when submission is successful
      localStorage.removeItem(storageKey);
      
      onClose(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${item?._id ? "update" : "create"} ${title.toLowerCase()}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = (success?: boolean) => {
    // Clear localStorage data when modal is closed after successful submission
    if (success) {
      localStorage.removeItem(storageKey);
    }
    onClose(success);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => handleModalClose()}
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
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-white">
                      {item ? `Edit ${title}` : `Add New ${title}`}
                    </Dialog.Title>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        className="rounded-lg bg-blue-800/30 p-2 text-blue-100 hover:bg-blue-800/50 focus:outline-none"
                        onClick={resetForm}
                      >
                        <ArrowPathIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-blue-800/30 p-2 text-blue-100 hover:bg-blue-800/50 focus:outline-none"
                        onClick={() => handleModalClose()}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {fields.map((field) => (
                      <div key={field.name as string} className="relative">
                        <div className="flex flex-col space-y-2">
                          <label
                            htmlFor={String(field.name)}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {field.label}
                            {field.required && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </label>

                          {field.type === "textarea" ? (
                            <textarea
                              id={String(field.name)}
                              name={String(field.name)}
                              value={formData[field.name] !== null && formData[field.name] !== undefined 
                                ? String(formData[field.name]) 
                                : ""}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className="block w-full rounded-xl border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                              rows={4}
                            />
                          ) : field.type === "select" ? (
                            <select
                            id={String(field.name)}
                            name={String(field.name)}
                              value={formData[field.name] !== null && formData[field.name] !== undefined 
                                ? String(formData[field.name]) 
                                : ""}
                              onChange={handleInputChange}
                              className="block w-full rounded-xl border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                            >
                              <option value="">Select {field.label}</option>
                              {field.options?.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "checkbox" ? (
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={String(field.name)}
                                name={String(field.name)}
                                checked={Boolean(formData[field.name])}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200"
                              />
                              {field.description && (
                                <span className="ml-2 text-sm text-gray-500">
                                  {field.description}
                                </span>
                              )}
                            </div>
                          ) : field.type === "array" && field.arrayConfig ? (
                            <ArrayField
                              items={Array.isArray(formData[field.name]) 
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ? (formData[field.name] as any[]) 
                                : []
                              }
                              onAdd={(item) => handleArrayAdd(field.name, item)}
                              onRemove={(index) => 
                                handleArrayRemove(field.name, index)
                              }
                              // eslint-disable-next-line @typescript-eslint/no-explicit-any
                              itemLabel={(field.arrayConfig as any).itemLabel || "Item"}
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={String(field.name)}
                              name={String(field.name)}
                              value={formData[field.name] !== null && formData[field.name] !== undefined 
                                ? String(formData[field.name]) 
                                : ""}
                              onChange={handleInputChange}
                              placeholder={field.placeholder}
                              className="block w-full rounded-xl border-gray-300 text-black shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                            />
                          )}

                          {errors[String(field.name)] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[String(field.name)]}
                            </p>
                          )}

                          {field.description && field.type !== "checkbox" && (
                            <p className="mt-1 text-sm text-gray-500">
                              {field.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {renderCustomFields &&
                      renderCustomFields(formData, setFormData)}
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => handleModalClose()}
                      className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center rounded-xl border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                          <span className="ml-2">Saving...</span>
                        </>
                      ) : (
                        <span>Save</span>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
