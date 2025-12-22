"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

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
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface FacultyInformationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: FacultyInformation | null;
}

export default function FacultyInformationModal({
  isOpen,
  onClose,
  item,
}: FacultyInformationModalProps) {
  const fields: Field<FacultyInformation>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["Regular", "Adjunct", "Guest"],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter Faculty Name",
    },
    {
      name: "designation",
      label: "Designation",
      type: "select" as const,
      required: true,
      options: ["Assistant Professor", "Associate Professor", "Professor"],
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter Faculty E-mail",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Enter Faculty phone",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      required: true,
      placeholder: "Enter image URL",
    },
    {
      name: "profileUrl",
      label: "Profile URL",
      type: "text",
      required: true,
      placeholder: "Enter profile URL",
    },
    {
      name: "office",
      label: "Office",
      type: "text",
      required: true,
      placeholder: "Enter office",
    },
    {
      name: "webpage",
      label: "Personal Web Page",
      type: "text",

      placeholder: "Enter personal web page",
    },
    {
      name: "education",
      label: "Education",
      type: "textarea",
      required: true,
      placeholder:
        "Enter education details (e.g., Ph.D. Computer Science, IIT Delhi)",
    },
    {
      name: "researchInterests",
      label: "Research Interests",
      type: "textarea",
      required: true,
      placeholder: "Enter faculty research interests",
    },
    {
      name: "order",
      label: "Order",
      type: "number",
      required: true,
      placeholder: "Enter order",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      description: "Make this faculty visible to others",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this faculty information public",
    },
  ];

  return (
    <GenericModal<FacultyInformation>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Faculty Information"
      apiEndpoint="/api/website-updates/faculty-information"
      fields={fields}
    />
  );
}
