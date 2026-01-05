"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import PatentModal from "./PatentModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Patent {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  patentNumber: string;
  applicationNumber: string;
  filingDate: string;
  grantDate: string;
  status: "Filed" | "Granted" | "Published";
  description: string;
  organization?: string;
  country?: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function PatentsPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "facultyInvolved",
      header: "Faculty Involved",
      render: (item: Patent) => (
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
      key: "patentNumber",
      header: "Patent Number",
    },
    {
      key: "applicationNumber",
      header: "Application Number",
    },
    {
      key: "filingDate",
      header: "Filing Date",
      render: (item: Patent) =>
        item.filingDate ? new Date(item.filingDate).toLocaleDateString() : "-",
    },
    {
      key: "grantDate",
      header: "Grant Date",
      render: (item: Patent) =>
        item.grantDate ? new Date(item.grantDate).toLocaleDateString() : "-",
    },
    {
      key: "status",
      header: "Status",
      render: (item: Patent) => {
        if (!item.status) return <span className="text-gray-400">Not set</span>;

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.status === "Granted"
                ? "bg-green-100 text-green-800"
                : item.status === "Filed"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        );
      },
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: ["filed", "granted", "published"],
    },
    {
      key: "country",
      label: "Country",
      type: "text" as const,
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Activity Portal", href: "/activity-portal" },
    { label: "Patents" },
  ];

  return (
    <GenericListPage<Patent>
      title="Patents"
      apiEndpoint="/api/activity-portal/patents"
      columns={columns}
      filters={filters}
      modal={PatentModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
