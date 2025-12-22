"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import VisitAbroadModal from "./VisitAbroadModal";

interface VisitAbroad {
  _id: string;
  countryVisited: string;
  fundingFrom: string;
  purpose: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function VisitAbroadPage() {
  const columns = [
    {
      key: "countryVisited",
      header: "Country Visited",
    },
    {
      key: "fundingFrom",
      header: "Funding Source",
    },
    {
      key: "purpose",
      header: "Purpose",
    },
    {
      key: "date",
      header: "Visit Date",
      render: (item: VisitAbroad) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: VisitAbroad) => (
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
      key: "countryVisited",
      label: "Country",
      type: "text" as const,
    },
    {
      key: "fundingFrom",
      label: "Funding Source",
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
    { label: "Visit Abroad" },
  ];

  return (
    <GenericListPage<VisitAbroad>
      title="Visit Abroad"
      apiEndpoint="/api/activity-portal/visit-abroad"
      columns={columns}
      filters={filters}
      modal={VisitAbroadModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
