"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

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
  }

interface SliderImageModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: SliderImage | null;
}

export default function SliderImageModal({
  isOpen,
  onClose,
  item,
}: SliderImageModalProps) {
  const fields: Field<SliderImage>[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter announcement title",
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "text",
      required: true,
      placeholder: "Enter image URL",
    },
    {
      name: "caption",
      label: "Caption",
      type: "text",
      placeholder: "Enter caption",
    },
    {
      name: "order",
      label: "Order",
      type: "number",
      placeholder: "Enter order",
    },
    {
      name: "linkUrl",
      label: "Link URL",
      type: "text",
      placeholder: "Enter link URL",
    },
    
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
      description: "Make this announcement visible to others",
    },
  ];

  return (
    <GenericModal<SliderImage>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Slider Image"
      apiEndpoint="/api/website-updates/slider-images"
      fields={fields}
    />
  );
}
