"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import PlacementStatisticsModal from "./PlacementStatisticsModal";

interface PlacementStatistics {
  _id: string;
  academicYear: string;
  category: "B.Tech" | "M.Tech";
  registeredCount: number;
  totalOffers: number;
  highestSalary: number;
  averageSalary: number;
  lowestSalary: number;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export default function PlacementStatisticsPage() {
  const columns = [
    {
      key: "academicYear",
      header: "Academic Year",
    },
    {
      key: "category",
      header: "Category",
      render: (item: PlacementStatistics) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "registeredCount",
      header: "Registered Count",
    },
    {
      key: "totalOffers",
      header: "Total Offers",
    },
    {
      key: "highestSalary",
      header: "Highest  (LPA)",
      render: (item: PlacementStatistics) => (
        <span>{item.highestSalary ? `${item.highestSalary} LPA` : "-"}</span>
      ),
    },
    {
      key: "averageSalary",
      header: "Average  (LPA)",
      render: (item: PlacementStatistics) => (
        <span>{item.averageSalary ? `${item.averageSalary} LPA` : "-"}</span>
      ),
    },
    {
      key: "lowestSalary",
      header: "Lowest  (LPA)",
      render: (item: PlacementStatistics) => (
        <span>{item.lowestSalary ? `${item.lowestSalary} LPA` : "-"}</span>
      ),
    },

    {
      key: "published",
      header: "Published",
      render: (item: PlacementStatistics) => (
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
      key: "academicYear" as keyof PlacementStatistics,
      label: "Academic Year",
      type: "text" as const,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: ["B.Tech", "M.Tech"],
    },
    {
      key: "published" as keyof PlacementStatistics,
      label: "Published",
      type: "select" as const,
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Placement Statistics" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Activity Portal", href: "/activity-portal", active: false },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  return (
    <GenericListPage<PlacementStatistics>
      title="Placement Statistics"
      apiEndpoint="/api/website-updates/placement-statistics"
      columns={columns}
      filters={filters}
      breadcrumbsItems={breadcrumbsItems}
      modal={PlacementStatisticsModal}
      navItems={navItems}
    />
  );
}
