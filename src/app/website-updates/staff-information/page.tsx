"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import type { FilterConfig } from "@/app/components/ui/GenericListPage";
import StaffInformationModal from "./StaffInformationModal";

interface StaffInformation {
  _id: string;
  category: "Technical" | "Non Technical";
  name: string;
  designation: string;
  email: string;
  imageUrl: string;
  PhD: string;
  areas: string;
  office: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  [key: string]: unknown;
}

export default function StaffInformationPage() {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "category",
      header: "Category",
      render: (item: StaffInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "Technical" 
              ? "bg-blue-100 text-blue-800" 
              : "bg-purple-100 text-purple-800"
          }`}
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
      key: "office",
      header: "Office",
    },
    {
      key: "isActive",
      header: "Active",
      render: (item: StaffInformation) => (
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
    {
      key: "published",
      header: "Published",
      render: (item: StaffInformation) => (
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

  const filters: FilterConfig<StaffInformation>[] = [
    {
      key: "category",
      label: "Category",
      type: "select",
      options: ["Technical", "Non Technical"],
    },
    {
      key: "isActive",
      label: "Status",
      type: "select",
      options: ["true", "false"],
    },
    {
      key: "published",
      label: "Published",
      type: "select",
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Staff Information" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  return (
    <GenericListPage<StaffInformation>
      title="Staff Information"
      apiEndpoint="/api/website-updates/staff-information"
      columns={columns}
      filters={filters}
      breadcrumbsItems={breadcrumbsItems}
      modal={StaffInformationModal}
      navItems={navItems}
    />
  );
} 