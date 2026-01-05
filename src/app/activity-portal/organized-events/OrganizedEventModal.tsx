"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface OrganizedEvent {
  _id?: string;
  category:
    | "Short-term Courses"
    | "Workshops"
    | "Seminars"
    | "Symposia"
    | "Conferences";
  title: string;
  facultyInvolved: Faculty[];
  venue: string;
  startDate: string;
  endDate: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface OrganizedEventModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: OrganizedEvent | null;
}

export default function OrganizedEventModal({
  isOpen,
  onClose,
  item,
}: OrganizedEventModalProps) {
  const fields: Field<OrganizedEvent>[] = [
    {
      name: "category",
      label: "Event Category",
      type: "select" as const,
      required: true,
      options: [
        "Short-term Courses",
        "Workshops",
        "Seminars",
        "Symposia",
        "Conferences",
      ],
    },
    {
      name: "title",
      label: "Event Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter event title",
    },
    {
      name: "facultyInvolved",
      label: "Faculty",
      type: "array",
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "venue",
      label: "Venue",
      type: "text" as const,
      required: true,
      placeholder: "Enter event venue",
    },
    {
      name: "startDate",
      label: "Start Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "endDate",
      label: "End Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Check this box to make the event record visible to others",
    },
  ];

  return (
    <GenericModal<OrganizedEvent>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Organized Event"
      apiEndpoint="/api/activity-portal/organized-events"
      fields={fields}
    />
  );
}
