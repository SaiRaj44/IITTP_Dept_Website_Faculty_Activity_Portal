"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import AttendEventModal from "./AttendEventModal";

interface Faculty {
  name: string;
  institute?: string;
}
interface AttendEvent {
  _id: string;
  category:
    | "Short-term Courses"
    | "Workshops"
    | "Seminars"
    | "Symposia"
    | "Conferences"
    | "Training";
  title: string;
  facultyInvolved: Faculty[];
  institution: string;
  studentsAttended: string;
  startDate: string;
  endDate: string;
  fundingFrom: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function AttendEventsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "facultyInvolved",
      header: "Faculty Involved",
      render: (item: AttendEvent) => (
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
      key: "category",
      header: "Category",
      render: (item: AttendEvent) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.category === "Conferences"
              ? "bg-purple-100 text-purple-800"
              : item.category === "Workshops"
              ? "bg-blue-100 text-blue-800"
              : item.category === "Seminars"
              ? "bg-green-100 text-green-800"
              : item.category === "Training"
              ? "bg-orange-100 text-orange-800"
              : item.category === "Symposia"
              ? "bg-pink-100 text-pink-800"
              : "bg-indigo-100 text-indigo-800"
          }`}
        >
          {item.category}
        </span>
      ),
    },
    {
      key: "institution",
      header: "Institution",
    },
    {
      key: "studentsAttended",
      header: "Students Attended",
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (item: AttendEvent) =>
        item.startDate ? new Date(item.startDate).toLocaleDateString() : "-",
    },
    {
      key: "endDate",
      header: "End Date",
      render: (item: AttendEvent) =>
        item.endDate ? new Date(item.endDate).toLocaleDateString() : "-",
    },

    {
      key: "published",
      header: "Status",
      render: (item: AttendEvent) => (
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
      options: [
        "Short-term Courses",
        "Workshops",
        "Seminars",
        "Symposia",
        "Conferences",
        "Training",
      ],
    },
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
      key: "fundingFrom",
      label: "Funding Source",
      type: "text" as const,
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
    { label: "Attended Events" },
  ];

  return (
    <GenericListPage<AttendEvent>
      title="Attended Events"
      apiEndpoint="/api/activity-portal/attend-events"
      columns={columns}
      filters={filters}
      modal={AttendEventModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
