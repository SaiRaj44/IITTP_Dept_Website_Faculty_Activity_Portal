"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface VisitAbroad {
  _id: string;
  countryVisited: string;
  fundingFrom: string;
  purpose: string;
  date: string;
  createdBy: string;
  published: boolean;
}

interface VisitAbroadModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: VisitAbroad | null;
}

export default function VisitAbroadModal({
  isOpen,
  onClose,
  item,
}: VisitAbroadModalProps) {
  const fields: Field<VisitAbroad>[] = [
    {
      name: "countryVisited",
      label: "Country Visited",
      type: "text",
      required: true,
      placeholder: "Enter country of visit",
    },
    {
      name: "purpose",
      label: "Purpose of Visit",
      type: "text",
      required: true,
      placeholder: "Enter purpose of visit",
    },
    {
      name: "fundingFrom",
      label: "Funding Source",
      type: "text",
      required: true,
      placeholder: "Enter funding source (if any)",
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
      description: "Make this visit record visible to others",
    },
  ];

  return (
    <GenericModal<VisitAbroad>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Visit Abroad"
      apiEndpoint="/api/activity-portal/visit-abroad"
      fields={fields}
    />
  );
}
