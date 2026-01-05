"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import JournalBoardModal from "./JournalBoardModal";

interface JournalBoard {
  _id: string;
  position: "Editor" | "Member";
  journalName: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function JournalEditorialBoardsPage() {
  const columns = [
    {
      key: "journalName",
      header: "Journal Name",
    },
    {
      key: "position",
      header: "Position",
      render: (item: JournalBoard) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.position === "Editor"
              ? "bg-purple-100 text-purple-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {item.position}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (item: JournalBoard) =>
        item.date ? new Date(item.date).toLocaleDateString() : "-",
    },
    {
      key: "published",
      header: "Status",
      render: (item: JournalBoard) => (
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
      key: "journalName",
      label: "Journal Name",
      type: "text" as const,
    },
    {
      key: "position",
      label: "Position",
      type: "select" as const,
      options: ["Editor", "Member"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Activity Portal", href: "/activity-portal" },
    { label: "Journal Editorial Boards" },
  ];

  return (
    <GenericListPage<JournalBoard>
      title="Journal Editorial Boards"
      apiEndpoint="/api/activity-portal/journal-editorial-boards"
      columns={columns}
      filters={filters}
      modal={JournalBoardModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
