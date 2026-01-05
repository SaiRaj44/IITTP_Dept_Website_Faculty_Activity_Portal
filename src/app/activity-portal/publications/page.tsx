"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import PublicationModal from "./PublicationModal";

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
  [key: string]: unknown;
}

export default function PublicationsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
      render: (item: Publication) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "facultyInvolved",
      header: "Faculty Involved",
      render: (item: Publication) => (
        <div className="space-y-1">
          {item.facultyInvolved.map((faculty, index) => (
            <div key={index}>
              {faculty.institute ? (
                <a
                  href={faculty.institute}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {faculty.name}
                </a>
              ) : (
                faculty.name
              )}
            </div>
          ))}
        </div>
      ),
    },

    {
      key: "url",
      header: "Link",
      render: (item: Publication) =>
        item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Publication
          </a>
        ) : (
          "-"
        ),
    },
    {
      key: "published",
      header: "Status",
      render: (item: Publication) => (
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
      type: "text" as const,
    },
    {
      key: "facultyInvolved",
      label: "Faculty Involved",
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
    { label: "Publications" },
  ];

  return (
    <GenericListPage<Publication>
      title="Publications"
      apiEndpoint="/api/activity-portal/publications"
      columns={columns}
      filters={filters}
      modal={PublicationModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
