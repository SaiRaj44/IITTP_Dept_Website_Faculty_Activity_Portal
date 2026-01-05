"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface PlacementStatistics {
  _id: string;
  academicYear: string;
  category: "B.Tech" | "M.Tech";
  registeredCount: number;
  totalOffers: number;
  highestSalary: number;
  averageSalary: number;
  lowestSalary: number;
  published: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PlacementStatisticsModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: PlacementStatistics | null;
}

export default function FacultyInformationModal({
  isOpen,
  onClose,
  item,
}: PlacementStatisticsModalProps) {
  const fields: Field<PlacementStatistics>[] = [
    {
      name: "academicYear",
      label: "Academic Year",
      type: "text",
      required: true,
      placeholder: "e.g., 2020-2024",
    },
    {
      name: "category",
      label: "Category",
      type: "select" as const,
      required: true,
      options: ["B.Tech", "M.Tech"],
    },
    {
      name: "registeredCount",
      label: "Registered Count",
      type: "number",
      required: true,
      placeholder: "Number of students registered for placement",
    },
    {
      name: "totalOffers",
      label: "Total Number of Offers",
      type: "number",
      required: true,
      placeholder: "Total placement offers received",
    },
    {
      name: "highestSalary",
      label: "Highest Salary (LPA)",
      type: "number",
      required: true,
      placeholder: "Highest package offered (in LPA)",
    },
    {
      name: "averageSalary",
      label: "Average Package (LPA)",
      type: "number",
      required: true,
      placeholder: "Average package offered (in LPA)",
    },
    {
      name: "lowestSalary",
      label: "Lowest Salary (LPA)",
      type: "number",
      required: true,
      placeholder: "Lowest package offered (in LPA)",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      description: "Make this placement statistic public",
    },
  ];

  return (
    <GenericModal<PlacementStatistics>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Placement Statistics"
      apiEndpoint="/api/website-updates/placement-statistics"
      fields={fields}
    />
  );
}
