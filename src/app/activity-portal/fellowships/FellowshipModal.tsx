"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Fellowship {
  _id: string;
  fellowshipName: string;
  facultyInvolved: Faculty[];
  admissionYear: string;
  date: Date;
  createdBy: string;
  published: boolean;
}
interface FellowshipModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Fellowship | null;
}

export default function FellowshipModal({
  isOpen,
  onClose,
  item,
}: FellowshipModalProps) {
  const fields: Field<Fellowship>[] = [
    {
      name: "fellowshipName",
      label: "Fellowship Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter fellowship title",
    },
    {
      name: "facultyInvolved",
      label: "Faculty Involved",
      type: "array" as const,
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "admissionYear",
      label: "Admission Year",
      type: "text" as const,
      required: true,
      placeholder: "Enter admission year",
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
      placeholder: "",
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox" as const,
      description: "Make this fellowship visible to others",
    },
  ];

  return (
    <GenericModal<Fellowship>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Fellowship"
      apiEndpoint="/api/activity-portal/fellowships"
      fields={fields}
    />
  );
}
