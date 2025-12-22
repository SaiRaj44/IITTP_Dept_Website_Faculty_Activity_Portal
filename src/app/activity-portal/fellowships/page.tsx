"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import FellowshipModal from "./FellowshipModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Fellowship {
  _id: string;
  fellowshipName: string;
  facultyInvolved: Faculty[];
  admissionYear: string;
  date: Date;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function FellowshipsPage() {
  const columns = [
    {
      key: "fellowshipName",
      header: "Fellowship Title",
    },
    {
      key: "admissionYear",
      header: "Admission Year",
    },
    {
      key: "date",
      header: "Date",
      render: (item: Fellowship) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Fellowship) => (
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
      key: "fellowshipName",
      label: "Title",
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
    { label: "Fellowships" },
  ];

  return (
    <GenericListPage<Fellowship>
      title="Fellowships"
      apiEndpoint="/api/activity-portal/fellowships"
      columns={columns}
      filters={filters}
      modal={FellowshipModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
