"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";
import { getApiBaseUrl } from "@/app/lib/utils";
import { useEffect, useState } from "react";

interface StaffInformation {
  _id: string;
  category: "Technical" | "Non Technical";
  name: string;
  designation: string;
  email: string;
  imageUrl: string;
  PhD: string;
  areas: string;
  office: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface StaffInformationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: StaffInformation | null;
}

export default function StaffInformationModal({
  isOpen,
  onClose,
  item,
}: StaffInformationModalProps) {
  const [apiUrl, setApiUrl] = useState("/api/website-updates/staff-information");
  
  useEffect(() => {
    // Update the API URL with the correct port
    setApiUrl(`${getApiBaseUrl()}/api/website-updates/staff-information`);
  }, []);

  const fields: Field<StaffInformation>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["Technical", "Non Technical"],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter Staff Name",
    },
    {
      name: "designation",
      label: "Designation",
      type: "text",
      required: true,
      placeholder: "Enter Staff Designation",
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter Staff E-mail",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      required: true,
      placeholder: "Enter image URL",
    },
    {
      name: "PhD",
      label: "PhD",
      type: "text",
      placeholder: "Enter PhD details (e.g., Ph.D - IISc, Bangalore)",
    },
    {
      name: "areas",
      label: "Areas of Expertise",
      type: "textarea",
      placeholder: "Enter staff expertise areas",
    },
    {
      name: "office",
      label: "Office",
      type: "text",
      placeholder: "Enter office location (e.g., AB1-224)",
    },
    {
      name: "order",
      label: "Order",
      type: "number",
      required: true,
      placeholder: "Enter display order",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      description: "Make this staff member visible to others",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this staff information public",
    },
  ];

  return (
    <GenericModal<StaffInformation>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Staff Information"
      apiEndpoint={apiUrl}
      fields={fields}
    />
  );
} 