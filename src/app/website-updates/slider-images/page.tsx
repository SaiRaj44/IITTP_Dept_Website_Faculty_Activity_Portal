"use client";

import GenericListPage from "@/app/components/ui/GenericListPage";
import SliderImageModal from "./SliderImageModal";

interface SliderImage {
  _id: string;
  title: string;
  imageUrl: string;
  caption: string;
  order: number;
  isActive: boolean;
  linkUrl: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  [key: string]: unknown;
}

export default function SliderImagesPage() {
  const columns = [
    {
      key: "title",
      header: "Title",
    },
    {
      key: "caption",
      header: "Caption",
    },
    {
      key: "imageUrl",
      header: "Image",
      render: (item: SliderImage) => (
        <img src={item.imageUrl} alt={item.title} className="w-16 h-16" />
      ),
    },
    {
      key: "linkUrl",
      header: "linkUrl",
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: SliderImage) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const filters = [
    {
      key: "title",
      label: "Title",
      type: "text" as const,
    },

    {
      key: "isActive",
      label: "Status",
      type: "select" as const,
      options: ["Active", "Inactive"],
    },
  ];

  const breadcrumbsItems = [
    { label: "Home", href: "" },
    { label: "Website Updates", href: "/website-updates" },
    { label: "Slider Images" },
  ];

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Activity Portal", href: "/activity-portal" },
    {
      name: "Website Updates",
      href: "/website-updates",
      active: true,
    },
  ];

  return (
    <GenericListPage<SliderImage>
      title="Slider Images"
      apiEndpoint="/api/website-updates/slider-images"
      columns={columns}
      filters={filters}
      modal={SliderImageModal}
      breadcrumbsItems={breadcrumbsItems}
      navItems={navItems}
    />
  );
}
