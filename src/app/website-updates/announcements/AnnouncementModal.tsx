"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

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
  published: boolean;
}

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Announcement | null;
}

export default function AnnouncementModal({
  isOpen,
  onClose,
  item,
}: AnnouncementModalProps) {
  const fields: Field<Announcement>[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter announcement title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea",
      required: true,
      placeholder: "Enter announcement content",
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: ["general", "academic", "event", "news"],
    },

    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      options: ["low", "normal", "high", "urgent"],
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      required: true,
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date",
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter the location",
    },
    {
      name: "time",
      label: "Time Duration",
      type: "text",
      placeholder: "Enter time duration",
    },
    {
      name: "attachmentUrl",
      label: "Attachment URL",
      type: "text",
      placeholder: "Enter attachment URL (optional)",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      description: "Make this announcement visible to others",
    },
  ];

  return (
    <GenericModal<Announcement>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Announcement"
      apiEndpoint="/api/website-updates/announcements"
      fields={fields}
    />
  );
}
