"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import StudentInformationModal from "./StudentInformationModal";

interface StudentInformation {
  _id: string;
  year: string;
  category: string;
  rollNumber: string;
  name: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export default function StudentInformationPage() {
  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "rollNumber",
      header: "Roll Number",
    },
    {
      key: "year",
      header: "Year",
      render: (item: StudentInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.year === "I"
              ? "bg-green-100 text-green-800"
              : item.year === "II"
              ? "bg-blue-100 text-blue-800"
              : item.year === "III"
              ? "bg-purple-100 text-purple-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.year}
        </span>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (item: StudentInformation) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "B.Tech"
              ? "bg-blue-100 text-blue-800"
              : item.category === "M.Tech"
              ? "bg-purple-100 text-purple-800"
              : item.category === "Ph.D"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },

    {
      key: "published",
      header: "Published",
      render: (item: StudentInformation) => (
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
      key: "name" as keyof StudentInformation,
      label: "Name",
      type: "text" as const,
    },
    {
      key: "rollNumber" as keyof StudentInformation,
      label: "Roll Number",
      type: "text" as const,
    },
    {
      key: "year" as keyof StudentInformation,
      label: "Year",
      type: "select" as const,
      options: ["I", "II", "III", "IV"],
    },
    {
      key: "category" as keyof StudentInformation,
      label: "Category",
      type: "select" as const,
      options: ["B.Tech", "M.Tech", "Ph.D"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Student Information" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard", active: false },
    { name: "Activity Portal", href: "/activity-portal", active: false },
    { name: "Website Updates", href: "/website-updates", active: true },
  ];

  return (
    <GenericListPage<StudentInformation>
      title="Student Information"
      apiEndpoint="/api/website-updates/student-information"
      columns={columns}
      filters={filters}
      breadcrumbsItems={breadcrumbsItems}
      modal={StudentInformationModal}
      navItems={navItems}
    />
  );
}
