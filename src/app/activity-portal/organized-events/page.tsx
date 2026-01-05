"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import OrganizedEventModal from "./OrganizedEventModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface OrganizedEvent {
  _id?: string;
  category: "Short-term Courses" | "Workshops" | "Seminars" | "Symposia" | "Conferences";
  title: string;
  facultyInvolved: Faculty[];
  venue: string;
  startDate: string;
  endDate: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function OrganizedEventsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "category",
      header: "Category",
      render: (item: OrganizedEvent) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.category === 'Conferences' ? 'bg-purple-100 text-purple-800' :
          item.category === 'Workshops' ? 'bg-blue-100 text-blue-800' :
          item.category === 'Seminars' ? 'bg-green-100 text-green-800' :
          item.category === 'Symposia' ? 'bg-pink-100 text-pink-800' :
          'bg-indigo-100 text-indigo-800'
        }`}>
          {item.category}
        </span>
      ),
    },
    {
      key: "facultyInvolved",
      header: "Organizers",
      render: (item: OrganizedEvent) => (
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
      key: "venue",
      header: "Venue",
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (item: OrganizedEvent) => item.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
    },
    {
      key: "endDate",
      header: "End Date",
      render: (item: OrganizedEvent) => item.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: OrganizedEvent) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    
  ];

  const filters = [
    {
      key: "category",
      label: "Category",
      type: "select" as const,
      options: ["Short-term Courses", "Workshops", "Seminars", "Symposia", "Conferences"],
    },
    {
      key: "title",
      label: "Title",
      type: "text" as const,
    },
    {
      key: "venue",
      label: "Venue",
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
    { label: "Organized Events" },
  ];

  return (
    <GenericListPage<OrganizedEvent>
      title="Organized Events"
      apiEndpoint="/api/activity-portal/organized-events"
      columns={columns}
      filters={filters}
      modal={OrganizedEventModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
} 