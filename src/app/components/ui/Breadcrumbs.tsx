"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChevronRight, FaHome } from "react-icons/fa";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // If no items provided, generate from pathname
  if (!items) {
    const paths = pathname.split("/").filter((path) => path);

    items = paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label =
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      
      return {
        href,
        label,
      };
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <Link href="/" className="hover:text-blue-500 flex items-center">
        <FaHome className="w-4 h-4" />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center">
            <FaChevronRight className="w-3 h-3 mx-2 text-gray-400" />
            {isLast || !item.href ? (
              <span className="text-gray-800 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-blue-500 hover:underline"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
