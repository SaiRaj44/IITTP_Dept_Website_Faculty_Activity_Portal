"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import NewsModal from "./NewsModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface News {
  _id: string;
  title: string;
  content: string;
  facultyInvolved: Faculty[];
  Url: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function NewsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "content",
      header: "Content",
    },
    {
      key: "authors",
      header: "Members",
      render: (item: News) =>
        item.facultyInvolved?.map((faculty) => faculty.name).join(", ") || "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: News) => (
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
      key: "title",
      label: "Title",
      type: "text" as const,
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "News" },
  ];

  return (
    <GenericListPage<News>
      title="News"
      apiEndpoint="/api/website-updates/news"
      columns={columns}
      filters={filters}
      modal={NewsModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
