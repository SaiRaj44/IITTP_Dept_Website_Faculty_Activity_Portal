"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface Visitor {
  _id: string;
  visitorDetails: string;
  purpose: string;
  date: Date;
  createdBy: string;
  published: boolean;
}

interface VisitorModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Visitor | null;
}

export default function VisitorModal({
  isOpen,
  onClose,
  item,
}: VisitorModalProps) {
  const fields: Field<Visitor>[] = [
    {
      name: "visitorDetails",
      label: "Visitor Details",
      type: "text",
      required: true,
      placeholder: "Enter visitor name",
    },
    {
      name: "purpose",
      label: "Purpose of Visit",
      type: "textarea",
      required: true,
      placeholder: "Enter purpose of visit",
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      required: true,
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox",
      description: "Make this visitor record visible to others",
    },
  ];

  return (
    <GenericModal<Visitor>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Visitor"
      apiEndpoint="/api/activity-portal/visitors"
      fields={fields}
    />
  );
}
