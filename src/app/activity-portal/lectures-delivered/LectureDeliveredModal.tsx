"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

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
}

interface LecturesDeliveredModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: LecturesDelivered | null;
}

export default function LecturesDeliveredModal({
  isOpen,
  onClose,
  item,
}: LecturesDeliveredModalProps) {
  const fields: Field<LecturesDelivered>[] = [
    {
      name: "title",
      label: "Lecture Topic",
      type: "text" as const,
      required: true,
      placeholder: "Enter lecture topic",
    },
    {
      name: "facultyInvolved",
      label: "Authors",
      type: "array" as const,
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "institution",
      label: "Institution",
      type: "text" as const,
      required: true,
      placeholder: "Enter institution name",
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
      name: "year",
      label: "Year",
      type: "text" as const,
      required: true,
      placeholder: "Enter year",
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
      description: "Make this book record visible to others",
    },
  ];

  return (
    <GenericModal<LecturesDelivered>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Lecture Delivered"
      apiEndpoint="/api/activity-portal/lectures-delivered"
      fields={fields}
    />
  );
}
