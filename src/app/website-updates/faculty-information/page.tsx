"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import FacultyInformationModal from "./FacultyInformationModal";

interface FacultyInformation {
  _id: string;
  category: "Regular" | "Adjunct" | "Guest";
  name: string;
  designation: "Assistant Professor" | "Associate Professor" | "Professor";
  email: string;
  phone: string;
  imageUrl: string;
  profileUrl: string;
  office: string;
  webpage: string;
  researchInterests: string;
  education: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  [key: string]: unknown;
}

export default function FacultyInformationPage() {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "category",
      header: "Category",
      render: (item: FacultyInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "designation",
      header: "Designation",
    },
    {
      key: "email",
      header: "E-mail",
    },
    {
      key: "phone",
      header: "Phone",
    },
    { key: "office", header: "Office" },
    {
      key: "isActive",
      header: "Status",
      render: (item: FacultyInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "name",
      label: "Name",
      type: "text" as const,
    },
    {
      key: "isActive",
      label: "Status",
      type: "select" as const,
      options: ["Active", "Inactive"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Faculty Information" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Activity Portal", href: "/activity-portal" },
    {
      name: "Website Updates",
      href: "/website-updates",
      active: true,
    },
  ];

  return (
    <GenericListPage<FacultyInformation>
      title="Faculty Information"
      apiEndpoint="/api/website-updates/faculty-information"
      columns={columns}
      filters={filters}
      modal={FacultyInformationModal}
      breadcrumbsItems={breadcrumbsItems}
      navItems={navItems}
    />
  );
}
