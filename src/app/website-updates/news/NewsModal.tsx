"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import ArrayField from "@/app/components/ui/ArrayField";
import type { Field } from "@/app/components/ui/GenericModal";

interface Faculty {
  name: string;
  institute?: string;
}

interface News {
  _id: string;
  title: string;
  content: string;
  facultyInvolved: Faculty[];
  Url: string;
  createdBy: string;
  published: boolean;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: News | null;
}

export default function NewsModal({ isOpen, onClose, item }: NewsModalProps) {
  const fields: Field<News>[] = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter news title",
    },
    {
      name: "content",
      label: "Content",
      type: "text" as const,
      required: true,
      placeholder: "Enter news content",
    },
    {
      name: "facultyInvolved",
      label: "Authors",
      type: "array" as const,
      required: true,
      arrayConfig: {
        component: ArrayField,
        initialItem: { name: "", institute: "" },
        minItems: 1,
      },
    },
    {
      name: "Url",
      label: "URL",
      type: "text" as const,
      required: false,
      placeholder: "Enter URL",
    },
    {
      name: "published",
      label: "Visibility",
      type: "checkbox" as const,
      description: "Make this news record visible to others",
    },
  ];

  return (
    <GenericModal<News>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="News"
      apiEndpoint="/api/website-updates/news"
      fields={fields}
    />
  );
}
