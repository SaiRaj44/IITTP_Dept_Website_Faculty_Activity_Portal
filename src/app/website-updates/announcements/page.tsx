"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import AnnouncementModal from "./AnnouncementModal";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  time: string;
  isActive: boolean;
  priority: string;
  attachmentUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  [key: string]: unknown;
}

export default function AnnouncementsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
      render: (item: Announcement) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      render: (item: Announcement) => {
        const priorityColors = {
          low: "bg-gray-100 text-gray-800",
          normal: "bg-blue-100 text-blue-800",
          high: "bg-yellow-100 text-yellow-800",
          urgent: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              priorityColors[item.priority as keyof typeof priorityColors]
            }`}
          >
            {item.priority}
          </span>
        );
      },
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (item: Announcement) =>
        new Date(item.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      header: "End Date",
      render: (item: Announcement) =>
        new Date(item.endDate).toLocaleDateString(),
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: Announcement) => (
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
      key: "category",
      label: "Category",
      type: "select" as const,
      options: ["general", "academic", "event", "news"],
    },
    {
      key: "priority",
      label: "Priority",
      type: "select" as const,
      options: ["low", "normal", "high", "urgent"],
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
    { label: "Announcements" },
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
    <GenericListPage<Announcement>
      title="Announcements"
      apiEndpoint="/api/website-updates/announcements"
      columns={columns}
      filters={filters}
      modal={AnnouncementModal}
      breadcrumbsItems={breadcrumbsItems}
      navItems={navItems}
    />
  );
}
