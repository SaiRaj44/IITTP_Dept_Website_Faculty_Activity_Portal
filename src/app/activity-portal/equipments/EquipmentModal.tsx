"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface Equipment {
  _id: string;
  equipmentName: string;
  value?: number;
  date: Date;
  createdBy: string;
  published: boolean;
}

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Equipment | null;
}

export default function EquipmentModal({
  isOpen,
  onClose,
  item,
}: EquipmentModalProps) {
  const fields: Field<Equipment>[] = [
    {
      name: "equipmentName",
      label: "Equipment Name",
      type: "text" as const,
      required: true,
      placeholder: "Enter equipment name",
    },

    {
      name: "value",
      label: "Value",
      type: "number" as const,
      required: true,
      placeholder: "Enter cost in INR",
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
      description: "Make this equipment visible to others",
    },
  ];

  return (
    <GenericModal<Equipment>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Equipment"
      apiEndpoint="/api/activity-portal/equipments"
      fields={fields}
    />
  );
}
