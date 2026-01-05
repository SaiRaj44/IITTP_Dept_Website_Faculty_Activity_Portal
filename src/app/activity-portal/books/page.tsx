"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import BookModal from "./BookModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Book {
  _id: string;
  category: "Monograph" | "Book";
  chapter: string;
  title: string;
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
  [key: string]: unknown;
}

export default function BooksPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
    },
    {
      key: "imgURL",
      header: "Image",
      render: (item: Book) => (
        <img src={item.imgURL} alt={item.title} className="w-16 h-16" />
      ),
    },
    {
      key: "authors",
      header: "Authors",
      render: (item: Book) =>
        item.facultyInvolved?.map((faculty) => faculty.name).join(", ") || "-",
    },
    {
      key: "publisher",
      header: "Publisher",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Book) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.published
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.published ? "Published" : "Draft"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: ["Monograph", "Book"],
    },

    {
      key: "publisher",
      label: "Publisher",
      type: "text" as const,
    },

    {
      key: "published",
      label: "Status",
      type: "select" as const,
      options: ["Published", "Draft"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Activity Portal", href: "/activity-portal" },
    { label: "Books" },
  ];

  return (
    <GenericListPage<Book>
      title="Books"
      apiEndpoint="/api/activity-portal/books"
      columns={columns}
      filters={filters}
      modal={BookModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
