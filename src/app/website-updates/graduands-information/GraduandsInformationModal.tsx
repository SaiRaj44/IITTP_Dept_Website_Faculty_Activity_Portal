"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface GraduandsInformation {
  _id: string;
  batch: string;
  category: string;
  imageUrl: string;
  rollNumber: string;
  name: string;
  createdBy: string;
  published: boolean;
}

interface GraduandsInformationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: GraduandsInformation | null;
}

export default function GraduandsInformationModal({
  isOpen,
  onClose,
  item,
}: GraduandsInformationModalProps) {
  const fields: Field<GraduandsInformation>[] = [
    {
      name: "batch",
      label: "Batch",
      type: "text",
      required: true,
      placeholder: "e.g., 2025",
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: ["B.Tech", "M.Tech", "Ph.D", "M.S.(R)"],
    },
    {
      name: "rollNumber",
      label: "Roll Number",
      type: "text",
      required: true,
      placeholder: "Enter roll number",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      required: false,
      placeholder: "Enter image URL",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter name",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this graduand information public",
    },
  ];

  return (
    <GenericModal<GraduandsInformation>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Graduand Information"
      apiEndpoint="/api/website-updates/graduands-information"
      fields={fields}
    />
  );
}
