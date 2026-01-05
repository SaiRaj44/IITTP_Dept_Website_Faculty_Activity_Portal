"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import ProjectModal from "./ProjectModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Project {
  _id: string;
  category:
    | "RBIC Project"
    | "Industrial Consultancy"
    | "Consultancy Project"
    | "Sponsored Project";
  title: string;
  facultyInvolved: Faculty[];
  year: string;
  industry: string;
  amount: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function ProjectsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
      render: (item: Project) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "RBIC Project"
              ? "bg-purple-100 text-purple-800"
              : item.category === "Industrial Consultancy"
              ? "bg-blue-100 text-blue-800"
              : item.category === "Consultancy Project"
              ? "bg-green-100 text-green-800"
              : item.category === "Sponsored Project"
              ? "bg-green-100 text-orange-800"
              : "bg-indigo-100 text-indigo-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "year",
      header: "Year",
    },
    {
      key: "industry",
      header: "Industry",
    },
    {
      key: "amount",
      header: "Amount",
    },
    {
      key: "date",
      header: "Date",
      render: (item: Project) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Project) => (
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
      key: "year",
      label: "Year",
      type: "text" as const,
    },
    {
      key: "title",
      label: "Title",
      type: "text" as const,
    },
    {
      key: "industry",
      label: "Industry",
      type: "text" as const,
    },

    {
      key: "published",
      label: "Status",
      type: "select" as const,
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Activity Portal", href: "/activity-portal" },
    { label: "Projects" },
  ];

  return (
    <GenericListPage<Project>
      title="Projects"
      apiEndpoint="/api/activity-portal/projects"
      columns={columns}
      filters={filters}
      modal={ProjectModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
