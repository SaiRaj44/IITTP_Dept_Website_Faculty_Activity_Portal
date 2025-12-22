"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Software {
  _id: string;
  details: string;
  facultyInvolved: Faculty[];
  date: string;
  createdBy: string;
  published: boolean;
}

interface SoftwareModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Software | null;
}

export default function SoftwareModal({
  isOpen,
  onClose,
  item,
}: SoftwareModalProps) {
  const fields: Field<Software>[] = [
    {
      name: "details",
      label: "Software Details",
      type: "textarea" as const,
      required: true,
      placeholder:
        "Enter software details including name, purpose, and features",
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
      name: "date",
      label: "Development Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox" as const,
      description:
        "Check this box to make the software record visible to others",
    },
  ];

  return (
    <GenericModal<Software>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Software"
      apiEndpoint="/api/activity-portal/software-designed"
      fields={fields}
    />
  );
}
