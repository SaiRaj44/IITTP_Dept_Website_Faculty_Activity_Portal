"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface Faculty {
  name: string;
  institute?: string;
}

interface Patent {
  _id: string;
  title: string;
  facultyInvolved: Faculty[];
  patentNumber: string;
  applicationNumber: string;
  filingDate: string;
  grantDate: string;
  status: "Filed" | "Granted" | "Published";
  description: string;
  organization?: string;
  country?: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface PatentModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Patent | null;
}

export default function PatentModal({
  isOpen,
  onClose,
  item,
}: PatentModalProps) {
  const fields: Field<Patent>[] = [
    {
      name: "title",
      label: "Patent Title",
      type: "text",
      required: true,
      placeholder: "Enter patent title",
    },
    {
      name: "facultyInvolved",
      label: "Inventors",
      type: "array",
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "patentNumber",
      label: "Patent Number",
      type: "text",
      placeholder: "Enter patent number",
    },
    {
      name: "applicationNumber",
      label: "Application Number",
      type: "text",
      placeholder: "Enter patent number",
    },
    {
      name: "filingDate",
      label: "Filing Date",
      type: "date",
    },
    {
      name: "grantDate",
      label: "Grant Date",
      type: "date",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: ["Filed", "Granted", "Published"],
    },
    {
      name: "description",
      label: "Patent Description",
      type: "text",
      placeholder: "Enter patent description in brief",
    },
    {
      name: "organization",
      label: "Patent Organization",
      type: "text",
      placeholder: "Enter patent Organization",
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Enter country name",
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
      type: "checkbox",
      description: "Make this patent visible to others",
    },
  ];

  return (
    <GenericModal<Patent>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Patent"
      apiEndpoint="/api/activity-portal/patents"
      fields={fields}
    />
  );
}
