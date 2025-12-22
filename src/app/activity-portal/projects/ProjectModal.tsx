"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Project {
  _id: string;
  category:
    | "RBIC Project"
    | "Industrial Consultancy"
    | "Consultancy Project"
    | "Sponsored Project";
  title: string;
  facultyInvolved: Faculty[];
  year: string;
  industry: string;
  amount: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Project | null;
}

export default function ProjectModal({
  isOpen,
  onClose,
  item,
}: ProjectModalProps) {
  const fields: Field<Project>[] = [
    {
      name: "category",
      label: "Event Type",
      type: "select",
      required: true,
      options: [
        "RBIC Project",
        "Inducstrial Consultancy",
        "Consultancy Project",
        "Sponsored Project",
      ],
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
      name: "title",
      label: "Project Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter project title",
    },
    {
      name: "year",
      label: "Year/ Duration",
      type: "text" as const,
      required: true,
      placeholder: "Enter project year",
    },
    {
      name: "industry",
      label: "Industry/ Funding Agency",
      type: "text" as const,
      required: true,
      placeholder: "Enter industry name",
    },
    {
      name: "amount",
      label: "Project Amount",
      type: "text" as const,
      required: true,
      placeholder: "Enter project amount in INR",
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
      required: true,
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox" as const,
      description:
        "Check this box to make the project record visible to others",
    },
  ];

  return (
    <GenericModal<Project>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Project"
      apiEndpoint="/api/activity-portal/projects"
      fields={fields}
    />
  );
}
