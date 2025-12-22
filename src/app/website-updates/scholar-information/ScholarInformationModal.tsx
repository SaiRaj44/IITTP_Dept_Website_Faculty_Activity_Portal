"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface ScholarInformation {
  _id: string;
  category: "PhD Regular" | "PhD External" | "MS Regular";
  name: string;
  imageUrl: string;
  year: string;
  batch: string;
  facultyInvolved: Faculty[];
  domain: string;
  email: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface ScholarInformationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: ScholarInformation | null;
}

export default function ScholarInformationModal({
  isOpen,
  onClose,
  item,
}: ScholarInformationModalProps) {
  const fields: Field<ScholarInformation>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["PhD Regular", "PhD External", "MS Regular"],
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter Scholar Name",
    },
    {
      name: "facultyInvolved",
      label: "Supervisor",
      type: "array" as const,
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      required: true,
      placeholder: "Enter image URL or scholar ID (e.g., cs18d501)",
    },
    {
      name: "year",
      label: "Year",
      type: "text",
      required: true,
      placeholder: "Enter joining year (e.g., 2018)",
    },
    {
      name: "batch",
      label: "Batch",
      type: "text",
      required: true,
      placeholder: "Enter joining batch (e.g., July)",
    },

    {
      name: "domain",
      label: "Research Domain",
      type: "text",
      required: true,
      placeholder: "Enter research domain (e.g., Algorithm Engineering)",
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      required: true,
      placeholder: "Enter scholar email (e.g., cs18d501@iittp.ac.in)",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      description: "Make this scholar visible to others",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this scholar information public",
    },
  ];

  return (
    <GenericModal<ScholarInformation>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Scholar Information"
      apiEndpoint="/api/website-updates/scholar-information"
      fields={fields}
    />
  );
}
