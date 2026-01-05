"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EnvelopeIcon, BookOpenIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

interface ScholarProps {
  name: string;
  category: string;
  imageUrl: string;
  year: string;
  batch: string;
  guide: string;
  guide_profileUrl?: string;
  domain: string;
  email: string;
}

export default function ScholarCard({
  name,
  category,
  imageUrl,
  year,
  batch,
  guide,
  guide_profileUrl,
  domain,
  email,
}: ScholarProps) {
  const getCategoryClass = (category: string) => {
    switch (category) {
      case "PhD Regular":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PhD External":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "MS Regular":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // If imageUrl doesn't start with http, assume it's a scholar ID and use a default image
  const displayImage = imageUrl.startsWith("http") 
    ? imageUrl 
    : `https://cse.iittp.ac.in/images/scholars/${imageUrl}.jpg`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 hover:border-blue-200 h-full flex flex-col">
      {/* Scholar Image and Category */}
      <div className="relative">
        <div className="w-full h-48 relative bg-gray-200">
          <Image
            src={displayImage}
            alt={name}
            fill
            style={{ objectFit: "cover" }}
            className="transition-all duration-500 hover:scale-105"
            onError={(e) => {
              // Fallback to a default image if the provided URL fails
              const target = e.target as HTMLImageElement;
              target.src = "https://cse.iittp.ac.in/images/placeholders/scholar-placeholder.jpg";
            }}
          />
        </div>
        
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryClass(category)}`}>
            {category}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-semibold text-gray-700">
          {year} • {batch} Batch
        </div>
      </div>

      {/* Scholar Information */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{name}</h3>
          
          <div className="space-y-2 mt-3">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-5 w-5 text-blue-600" />
              </div>
              <p className="ml-2 text-sm text-gray-600">{domain}</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-2 text-sm">
                <span className="text-gray-600">Guide: </span>
                {guide_profileUrl ? (
                  <Link 
                    href={guide_profileUrl} 
                    className="text-blue-600 hover:underline"
                  >
                    {guide}
                  </Link>
                ) : (
                  <span className="text-gray-800">{guide}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <a 
                href={`mailto:${email}`} 
                className="ml-2 text-sm text-blue-600 hover:underline"
              >
                {email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 