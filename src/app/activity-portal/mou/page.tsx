"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import MoUModal from "./MoUModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface MoU {
  _id: string;
  details: string;
  facultyInvolved: Faculty[];
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function MoUPage() {
  const columns = [
    {
      key: "details",
      header: "MoU Details",
    },
    {
      key: "date",
      header: "Date",
      render: (item: MoU) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: MoU) => (
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
    { label: "MoU Designed" },
  ];

  return (
    <GenericListPage<MoU>
      title="MoU Designed"
      apiEndpoint="/api/activity-portal/mou"
      columns={columns}
      filters={filters}
      modal={MoUModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
