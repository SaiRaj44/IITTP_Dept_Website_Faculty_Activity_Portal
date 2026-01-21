"use client";

import GenericModal from "@/app/components/ui/GenericModal";
import type { Field } from "@/app/components/ui/GenericModal";

interface Newsletter {
  _id: string;
  title: string;
  content: string;
  newsItems: string[];
  publicationDate: string;
  createdBy: string;
  published: boolean;
  subscribers: Array<{
    email: string;
    name?: string;
  }>;
}

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
  item: Newsletter | null;
}

export default function NewsletterModal({ isOpen, onClose, item }: NewsletterModalProps) {
  const fields: Field<Newsletter>[] = [
    {
      name: "title",
      label: "Title",
      type: "text" as const,
      required: true,
      placeholder: "Enter newsletter title",
    },
    {
      name: "content",
      label: "Content",
      type: "textarea" as const,
      required: true,
      placeholder: "Enter newsletter content",
    },
    {
      name: "publicationDate",
      label: "Publication Date",
      type: "date" as const,
      required: false,
      placeholder: "Select publication date",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox" as const,
      description: "Publish this newsletter",
    },
  ];

  return (
    <GenericModal<Newsletter>
      isOpen={isOpen}
      onClose={onClose}
      item={item}
      title="Newsletter"
      apiEndpoint="/api/website-updates/newsletter"
      fields={fields}
    />
  );
}