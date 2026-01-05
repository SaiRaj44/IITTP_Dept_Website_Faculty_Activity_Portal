"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface StudentInformation {
  _id: string;
  year: string;
  category: string;
  rollNumber: string;
  name: string;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentInformationModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: StudentInformation | null;
}

export default function StudentInformationModal({
  isOpen,
  onClose,
  item,
}: StudentInformationModalProps) {
  const fields: Field<StudentInformation>[] = [
    {
      name: "year",
      label: "Year",
      type: "select",
      required: true,
      options: ["I", "II", "III", "IV"],
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: ["B.Tech", "M.Tech", "Ph.D"],
    },
    {
      name: "rollNumber",
      label: "Roll Number",
      type: "text",
      required: true,
      placeholder: "Enter roll number",
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
      placeholder: "Enter student name",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this student information public",
    },
  ];

  return (
    <GenericModal<StudentInformation>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Student Information"
      apiEndpoint="/api/website-updates/student-information"
      fields={fields}
    />
  );
}
