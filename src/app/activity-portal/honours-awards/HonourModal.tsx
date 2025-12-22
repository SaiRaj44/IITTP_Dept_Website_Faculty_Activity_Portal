"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Honour {
  _id: string;
  category: "Award" | "Recognition";
  facultyInvolved: Faculty[];
  awardName: string;
  person: "Faculty" | "Student";
  awardBy: string;
  awardFor: string;
  imgUrl: string;
  date: string;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

interface HonourModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Honour | null;
}

export default function HonourModal({
  isOpen,
  onClose,
  item,
}: HonourModalProps) {
  const fields: Field<Honour>[] = [
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["Award", "Recognition"],
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
      name: "awardName",
      label: "Award Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter award name",
    },
    {
      name: "awardBy",
      label: "Awarded By",
      type: "text" as const,
      required: true,
      placeholder: "Enter awarding organization/institution",
    },
    {
      name: "awardFor",
      label: "Awarded For",
      type: "textarea" as const,
      required: true,
      placeholder: "Enter reason or achievement for the award",
    },
    {
      name: "person",
      label: "Person",
      type: "select" as const,
      required: true,
      options: ["Faculty", "Student"],
    },
    {
      name: "date",
      label: "Award Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "imgUrl",
      label: "Image URL",
      type: "text" as const,
      required: false,
      placeholder: "Enter image URL",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox" as const,
      description: "Check this box to make the award record visible to others",
    },
  ];

  return (
    <GenericModal<Honour>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Honour/Award"
      apiEndpoint="/api/activity-portal/honours-awards"
      fields={fields}
    />
  );
}
