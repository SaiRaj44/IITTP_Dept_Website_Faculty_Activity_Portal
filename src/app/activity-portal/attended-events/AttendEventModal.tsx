"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

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
}

interface AttendEventModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: AttendEvent | null;
}

export default function AttendEventModal({
  isOpen,
  onClose,
  item,
}: AttendEventModalProps) {

  const fields: Field<AttendEvent>[] = [
    {
      name: "category", // Must be a key of AttendEvent
      label: "Event Type",
      type: "select",
      required: true,
      options: ["Conference", "Workshop", "Seminar"],
    },
    {
      name: "title",
      label: "Event Title",
      type: "text",
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
      name: "institution",
      label: "Institution",
      type: "text",
      required: true,
      placeholder: "Enter institution name",
    },
    {
      name: "studentsAttended",
      label: "Students Attended",
      type: "text",
      required: true,
      placeholder: "Enter number or names of students",
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
      name: "fundingFrom",
      label: "Funding Source",
      type: "text",
      required: true,
      placeholder: "Enter funding source",
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
    <GenericModal<AttendEvent>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Attended Event"
      apiEndpoint="/api/activity-portal/attend-events"
      fields={fields}
    />
  );
}
