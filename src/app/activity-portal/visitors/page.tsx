"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import VisitorModal from "./VisitorModal";

interface Visitor {
  _id: string;
  visitorDetails: string;
  purpose: string;
  date: Date;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function VisitorsPage() {
  const columns = [
    {
      key: "visitorDetails",
      header: "Visitor Details",
    },
    {
      key: "purpose",
      header: "Purpose",
    },
    {
      key: "date",
      header: "Visit Date",
      render: (item: Visitor) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Visitor) => (
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
      key: "visitorDetails",
      label: "Visitor Details",
      type: "text" as const,
    },
    {
      key: "purpose",
      label: "Purpose",
      type: "text" as const,
    },
    {
      key: "date",
      label: "Visit Date",
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
    { label: "Visitors" },
  ];

  return (
    <GenericListPage<Visitor>
      title="Visitors"
      apiEndpoint="/api/activity-portal/visitors"
      columns={columns}
      filters={filters}
      modal={VisitorModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
