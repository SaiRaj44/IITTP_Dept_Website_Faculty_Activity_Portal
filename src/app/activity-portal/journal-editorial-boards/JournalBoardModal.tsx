"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface JournalBoard {
  _id: string;
  position: "Editor" | "Member";
  journalName: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface JournalBoardModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: JournalBoard | null;
}

export default function JournalBoardModal({
  isOpen,
  onClose,
  item,
}: JournalBoardModalProps) {
  const fields: Field<JournalBoard>[] = [
    {
      name: "journalName",
      label: "Journal Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter journal name",
    },
    {
      name: "position",
      label: "Position",
      type: "select" as const,
      required: true,
      options: ["Editor", "Member"],
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox" as const,
      description: "Make this editorial board position visible to others",
    },
  ];

  return (
    <GenericModal<JournalBoard>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Journal Editorial Board"
      apiEndpoint="/api/activity-portal/journal-editorial-boards"
      fields={fields}
    />
  );
}
