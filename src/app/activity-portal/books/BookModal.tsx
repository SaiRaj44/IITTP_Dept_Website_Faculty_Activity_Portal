"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Book {
  _id: string;
  category: "Monograph" | "Book";
  title: string;
  chapter: string;
  facultyInvolved: Faculty[];
  publisher: string;
  volume: string;
  pages: string;
  isbn?: string;
  year?: string;
  month?: string;
  imgURL?: string;
  url?: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface BookModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Book | null;
}

export default function BookModal({ isOpen, onClose, item }: BookModalProps) {
  const fields: Field<Book>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["Book", "Monograph"],
    },
    {
      name: "chapter",
      label: "Chapter",
      type: "text" as const,
      required: true,
      placeholder: "Enter chapter title",
    },
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter book title",
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
      name: "publisher",
      label: "Publisher",
      type: "text" as const,
      required: true,
      placeholder: "Enter publisher name",
    },
    {
      name: "volume",
      label: "Volume",
      type: "text" as const,
      required: true,
      placeholder: "Enter volume number",
    },
    {
      name: "pages",
      label: "Pages",
      type: "text" as const,
      required: true,
      placeholder: "Enter pages (e.g, 1-44)",
    },
    {
      name: "isbn",
      label: "ISBN",
      type: "text" as const,
      placeholder: "Enter ISBN number",
    },
    {
      name: "year",
      label: "Year",
      type: "text" as const,
      placeholder: "Enter Year",
    },
    {
      name: "month",
      label: "Month",
      type: "text" as const,
      placeholder: "Enter month",
    },
    {
      name: "imgURL",
      label: "Image URL",
      type: "text",
      required: true,
      placeholder: "Enter image URL",
    },
    {
      name: "url",
      label: "URL",
      type: "text" as const,
      required: false,
      placeholder: "Enter url",
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox" as const,
      description: "Make this book record visible to others",
    },
  ];

  return (
    <GenericModal<Book>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Book"
      apiEndpoint="/api/activity-portal/books"
      fields={fields}
    />
  );
}
