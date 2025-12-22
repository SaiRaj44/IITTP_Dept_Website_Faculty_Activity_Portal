"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import GraduandsInformationModal from "./GraduandsInformationModal";

interface GraduandsInformation {
  _id: string;
  batch: string;
  category: string;
  rollNumber: string;
  name: string;
  imageUrl: string;
  published: boolean;
  createdBy: string;
  [key: string]: unknown;
}

export default function GraduandsInformationPage() {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "batch",
      header: "Batch",
    },
    {
      key: "category",
      header: "Specialization",
      render: (item: GraduandsInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "B.Tech"
              ? "bg-blue-100 text-blue-800"
              : item.category === "M.Tech"
              ? "bg-purple-100 text-purple-800"
              : item.category === "Ph.D"
              ? "bg-red-100 text-red-800"
              : item.category === "M.S.(R)"
              ? "bg-orange-100 text-orange-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "rollNumber",
      header: "Roll Number",
    },

    {
      key: "published",
      header: "Published",
      render: (item: GraduandsInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.published
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.published ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "name" as keyof GraduandsInformation,
      label: "Name",
      type: "text" as const,
    },
    {
      key: "batch" as keyof GraduandsInformation,
      label: "Batch",
      type: "text" as const,
    },
    {
      key: "category" as keyof GraduandsInformation,
      label: "Category",
      type: "select" as const,
      options: ["B.Tech", "M.Tech", "Ph.D", "M.S.(R)"],
    },
    {
      key: "published" as keyof GraduandsInformation,
      label: "Published",
      type: "select" as const,
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Graduands Information" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Activity Portal", href: "/activity-portal", active: false },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  return (
    <GenericListPage<GraduandsInformation>
      title="Graduands Information"
      apiEndpoint="/api/website-updates/graduands-information"
      columns={columns}
      filters={filters}
      breadcrumbsItems={breadcrumbsItems}
      modal={GraduandsInformationModal}
      navItems={navItems}
    />
  );
}
