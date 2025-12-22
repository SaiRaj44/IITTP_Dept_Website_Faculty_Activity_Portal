"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Publication {
  _id: string;
  category:
    | "International Journal"
    | "National Journal"
    | "International Conference"
    | "National Conference";
  title: string;
  facultyInvolved: Faculty[];
  journal_name: string;
  year: string;
  volume: string;
  month: string;
  doi?: string;
  pages?: string;
  url?: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface PublicationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Publication | null;
}

export default function PublicationModal({
  isOpen,
  onClose,
  item,
}: PublicationModalProps) {
  const fields: Field<Publication>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: [
        "International Journal",
        "National Journal",
        "International Conference",
        "National Conference",
      ],
    },
    {
      name: "title",
      label: "Publication Title",
      type: "text",
      required: true,
      placeholder: "Enter publication title",
    },
    {
      name: "facultyInvolved",
      label: "Authors",
      type: "array" as const,
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "journal_name",
      label: "Journal Name",
      type: "text",
      placeholder: "Enter journal name",
    },
    {
      name: "year",
      label: "Publication Year",
      type: "text",
      required: true,
      placeholder: "Enter publication year",
    },
    {
      name: "volume",
      label: "Volume",
      type: "text",
      placeholder: "Enter volume number",
    },
    {
      name: "month",
      label: "Month",
      type: "text",
      placeholder: "Enter month",
    },
    {
      name: "doi",
      label: "DOI",
      type: "text",
      placeholder: "Enter DOI",
    },
    {
      name: "pages",
      label: "Pages",
      type: "text",
      placeholder: "Enter page range (e.g., 123-145)",
    },
    {
      name: "url",
      label: "URL",
      type: "text",
      placeholder: "Enter url",
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox",
      description: "Make this publication visible to others",
    },
  ];

  return (
    <GenericModal<Publication>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Publication"
      apiEndpoint="/api/activity-portal/publications"
      fields={fields}
    />
  );
}
