"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import LectureDeliveredModal from "./LectureDeliveredModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface LecturesDelivered {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  institution: string;
  startDate: string;
  endDate: string;
  year: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function LecturesDeliveredsPage() {
  const columns = [
    {
      key: "title",
      header: "Topic",
    },
    {
      key: "facultyInvloved",
      header: "Authors",
      render: (item: LecturesDelivered) =>
        item.facultyInvolved?.map((faculty) => faculty.name).join(", ") || "-",
    },
    {
      key: "institution",
      header: "Institution",
    },
    {
      key: "year",
      header: "Year",
    },
    {
      key: "published",
      header: "Status",
      render: (item: LecturesDelivered) => (
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
      key: "title",
      label: "Title",
      type: "text" as const,
    },
    {
      key: "institution",
      label: "Institution",
      type: "text" as const,
    },
    {
      key: "startDate",
      label: "Start Date",
      type: "date" as const,
    },
    {
      key: "endDate",
      label: "End Date",
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
    { label: "Lectures Delivered" },
  ];

  return (
    <GenericListPage<LecturesDelivered>
      title="Lectures Delivered"
      apiEndpoint="/api/activity-portal/lectures-delivered"
      columns={columns}
      filters={filters}
      modal={LectureDeliveredModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
