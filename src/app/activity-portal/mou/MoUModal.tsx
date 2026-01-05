"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface MoU {
  _id: string;
  details: string;
  facultyInvolved: Faculty[];
  date: string;
  createdBy: string;
  published: boolean;
}

interface MoUModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: MoU | null;
}

export default function MoUModal({ isOpen, onClose, item }: MoUModalProps) {
  const fields: Field<MoU>[] = [
    {
      name: "details",
      label: "MoU Details",
      type: "textarea" as const,
      required: true,
      placeholder: "Enter MoU details including name, purpose, and features",
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
      description: "Check this box to make the MoU record visible to others",
    },
  ];

  return (
    <GenericModal<MoU>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="MoU"
      apiEndpoint="/api/activity-portal/mou"
      fields={fields}
    />
  );
}
