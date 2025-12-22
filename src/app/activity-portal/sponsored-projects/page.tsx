"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import SponsoredProjectModal from "./SponsoredProjectModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface SponsoredProject {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  duration: string;
  fundingAgency: string;
  amount: string;
  status: "Ongoing" | "Completed";
  date: Date;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function SponsoredProjectsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "duration",
      header: "Duration",
    },
    {
      key: "fundingAgency",
      header: "Funding Agency",
    },
    {
      key: "amount",
      header: "Amount",
    },
    {
      key: "status",
      header: "Project Status",
      render: (item: SponsoredProject) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.status === "Ongoing"
              ? "bg-purple-100 text-purple-800"
              : item.status === "Completed"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "published",
      header: "Status",
      render: (item: SponsoredProject) => (
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
    {
      key: "fundingAgency",
      label: "Funding Agency",
      type: "text" as const,
    },
    {
      key: "date",
      label: "Date",
      type: "date" as const,
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
    { label: "Sponsored Projects" },
  ];

  return (
    <GenericListPage<SponsoredProject>
      title="Sponsored Projects"
      apiEndpoint="/api/activity-portal/sponsored-projects"
      columns={columns}
      filters={filters}
      modal={SponsoredProjectModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
