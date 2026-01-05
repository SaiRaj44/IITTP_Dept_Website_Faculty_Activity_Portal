"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import EquipmentModal from "./EquipmentModal";

interface Equipment {
  _id: string;
  equipmentName: string;
  value?: number;
  date: Date;
  createdBy: string;
  published: boolean;
  [key: string]: unknown;
}

export default function EquipmentsPage() {
  const columns = [
    {
      key: "equipmentName",
      header: "Equipment Name",
    },
    {
      key: "value",
      header: "Equipment Value",
    },

    // {
    //   key: "value",
    //   header: "Value",
    //   render: (item: Equipment) =>
    //     new Intl.NumberFormat("en-IN", {
    //       style: "currency",
    //       currency: "INR",
    //     }).format(item.value),
    // },

    {
      key: "published",
      header: "Visibility",
      render: (item: Equipment) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.published
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.published ? "Public" : "Private"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "equipmentName",
      label: "Name",
      type: "text" as const,
    },
    {
      key: "value",
      label: "Value",
      type: "text" as const,
    },

    {
      key: "published",
      label: "Visibility",
      type: "select" as const,
      options: ["true", "false"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "/" },
    { label: "Activity Portal", href: "/activity-portal" },
    { label: "Equipment" },
  ];

  return (
    <GenericListPage<Equipment>
      title="Equipment"
      apiEndpoint="/api/activity-portal/equipments"
      columns={columns}
      filters={filters}
      modal={EquipmentModal}
      breadcrumbsItems={breadcrumbsItems}
    />
  );
}
