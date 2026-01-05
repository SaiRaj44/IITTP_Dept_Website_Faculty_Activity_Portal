import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs = [],
}) => {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {breadcrumbs.length > 0 && (
        <nav className="flex mb-4" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center space-x-2">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="flex items-center">
                  {!isLast ? (
                    <>
                      <Link
                        href={item.href}
                        className="text-gray-500 hover:text-blue-600 transition-colors text-sm"
                      >
                        {item.name}
                      </Link>
                      <span className="mx-2 text-gray-300">/</span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-medium text-sm">
                      {item.name}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      
      {description && (
        <p className="mt-3 text-gray-600 max-w-4xl">{description}</p>
      )}
    </div>
  );
};

export default PageHeader; 