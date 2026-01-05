"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface SponsoredProject {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  duration: string;
  fundingAgency: string;
  amount: string;
  status: "Ongoing" | "Completed";
  date: Date;
  createdBy: string;
  published: boolean;
}

interface SponsoredProjectModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: SponsoredProject | null;
}

export default function SponsoredProjectModal({
  isOpen,
  onClose,
  item,
}: SponsoredProjectModalProps) {
  const fields: Field<SponsoredProject>[] = [
    {
      name: "title",
      label: "Project Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter project title",
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
      name: "duration",
      label: "Project Duration",
      type: "text" as const,
      required: true,
      placeholder: "Enter project duration",
    },
    {
      name: "fundingAgency",
      label: "Funding Agency",
      type: "text" as const,
      required: true,
      placeholder: "Enter funding agency name",
    },

    {
      name: "amount",
      label: "Project Amount",
      type: "text" as const,
      required: true,
      placeholder: "Enter amount in INR",
    },
    {
      name: "status",
      label: "Status",
      type: "select" as const,
      required: true,
      options: ["Ongoing", "Completed"],
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
      description: "Make this project visible to others",
    },
  ];

  return (
    <GenericModal<SponsoredProject>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Sponsored Project"
      apiEndpoint="/api/activity-portal/sponsored-projects"
      fields={fields}
    />
  );
}
