"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import SoftwareModal from "./SoftwareModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Software {
  _id: string;
  details: string;
  facultyInvolved: Faculty[];
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function SoftwareDesignedPage() {
  const columns = [
    {
      key: "details",
      header: "Software Details",
    },
    {
      key: "date",
      header: "Date",
      render: (item: Software) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Software) => (
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
      key: "details",
      label: "Details",
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
    { label: "Software Designed" },
  ];

  return (
    <GenericListPage<Software>
      title="Software Designed"
      apiEndpoint="/api/activity-portal/software-designed"
      columns={columns}
      filters={filters}
      modal={SoftwareModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
