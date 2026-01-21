"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import NewsletterModal from "./NewsletterModal";

interface Newsletter {
  _id: string;
  title: string;
  content: string;
  newsItems: string[];
  publicationDate: string;
  createdBy: string;
  published: boolean;
  subscribers: Array<{
    email: string;
    name?: string;
  }>;
  [key: string]: unknown;
}

export default function NewsletterPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "content",
      header: "Content",
      render: (item: Newsletter) =>
        item.content?.length > 100
          ? `${item.content.substring(0, 100)}...`
          : item.content || "-",
    },
    {
      key: "publicationDate",
      header: "Publication Date",
      render: (item: Newsletter) =>
        item.publicationDate
          ? new Date(item.publicationDate).toLocaleDateString()
          : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Newsletter) => (
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
    { label: "Newsletter" },
  ];

  return (
    <GenericListPage<Newsletter>
      title="Department Newsletter"
      apiEndpoint="/api/website-updates/newsletter"
      columns={columns}
      filters={filters}
      modal={NewsletterModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}