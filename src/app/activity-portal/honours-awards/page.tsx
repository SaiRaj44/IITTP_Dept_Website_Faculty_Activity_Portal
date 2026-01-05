"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import HonourModal from "./HonourModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Honour {
  _id: string;
  category: "Award" | "Recognition";
  facultyInvolved: Faculty[];
  person: "Faculty" | "Student";
  awardName: string;
  imgUrl: string;
  awardBy: string;
  awardFor: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function HonoursAwardsPage() {
  const columns = [
    {
      key: "awardName",
      header: "Award Name",
    },
    {
      key: "category",
      header: "Category",
      render: (item: Honour) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "Award"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "awardBy",
      header: "Awarded By",
    },
    {
      key: "awardFor",
      header: "Awarded For",
    },
    {
      key: "date",
      header: "Date",
      render: (item: Honour) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: Honour) => (
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
      type: "select" as const,
      options: ["Award", "Recognition"],
    },
    {
      key: "awardName",
      label: "Award Name",
      type: "text" as const,
    },
    {
      key: "awardBy",
      label: "Awarded By",
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
    { label: "Honours & Awards" },
  ];

  return (
    <GenericListPage<Honour>
      title="Honours & Awards"
      apiEndpoint="/api/activity-portal/honours-awards"
      columns={columns}
      filters={filters}
      modal={HonourModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
