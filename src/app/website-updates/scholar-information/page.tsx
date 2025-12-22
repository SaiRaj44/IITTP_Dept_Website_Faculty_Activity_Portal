"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import ScholarInformationModal from "./ScholarInformationModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface ScholarInformation {
  _id: string;
  category: "PhD Regular" | "PhD External" | "MS Regular";
  name: string;
  imageUrl: string;
  year: string;
  batch: string;
  facultyInvolved: Faculty[];
  domain: string;
  email: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  [key: string]: unknown;
}

export default function ScholarInformationPage() {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "category",
      header: "Category",
      render: (item: ScholarInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "PhD Regular"
              ? "bg-blue-100 text-blue-800"
              : item.category === "PhD External"
              ? "bg-purple-100 text-purple-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "facultyInvolved",
      header: "Faculty Involved",
      render: (item: ScholarInformation) => (
        <div className="space-y-1">
          {item.facultyInvolved.map((faculty, index) => (
            <div key={index}>
              {faculty.institute ? (
                <a
                  href={faculty.institute}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {faculty.name}
                </a>
              ) : (
                faculty.name
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "year",
      header: "Year",
    },
    {
      key: "batch",
      header: "Batch",
    },
    {
      key: "domain",
      header: "Research Domain",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "isActive",
      header: "Active",
      render: (item: ScholarInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "year" as keyof ScholarInformation,
      label: "Year",
      type: "text" as const,
    },
    {
      key: "batch" as keyof ScholarInformation,
      label: "Batch",
      type: "text" as const,
    },
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: ["PhD Regular", "PhD External", "MS Regular"],
    },
    {
      key: "isActive" as keyof ScholarInformation,
      label: "Status",
      type: "select" as const,
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Scholar Information" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  return (
    <GenericListPage<ScholarInformation>
      title="Scholar Information"
      apiEndpoint="/api/website-updates/scholar-information"
      columns={columns}
      filters={filters}
      breadcrumbsItems={breadcrumbsItems}
      modal={ScholarInformationModal}
      navItems={navItems}
    />
  );
}
