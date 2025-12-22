// Types for faculty information
export interface Faculty {
  _id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  imageUrl: string;
  specialization?: string;
  researchInterests?: string[];
  education?: string;
  biography?: string;
  officeLocation?: string;
  phoneNumber?: string;
  personalWebsite?: string;
  googleScholar?: string;
  linkedIn?: string;
  github?: string;
  publications?: number;
  projects?: number;
  patents?: number;
  awards?: string[];
  teaching?: string[];
  order: number;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// New faculty information interface with more specific typing
export interface FacultyInformation {
  _id: string;
  category: "Regular" | "Adjunct" | "Guest";
  name: string;
  designation: "Assistant Professor" | "Associate Professor" | "Professor";
  email: string;
  phone: string;
  imageUrl: string;
  researchInterests: string;
  education: string;
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

// Default empty state for faculty information
export const emptyFaculty: Omit<Faculty, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  designation: "",
  department: "Computer Science & Engineering",
  email: "",
  imageUrl: "",
  specialization: "",
  researchInterests: [],
  education: "",
  biography: "",
  officeLocation: "",
  phoneNumber: "",
  personalWebsite: "",
  googleScholar: "",
  linkedIn: "",
  github: "",
  publications: 0,
  projects: 0,
  patents: 0,
  awards: [],
  teaching: [],
  order: 0,
  createdBy: "",
  published: false,
};

// Default empty state for new faculty information structure
export const emptyFacultyInformation: Omit<FacultyInformation, "_id" | "createdAt" | "updatedAt"> = {
  category: "Regular",
  name: "",
  designation: "Assistant Professor",
  email: "",
  phone: "",
  imageUrl: "",
  researchInterests: "",
  education: "",
  order: 0,
  isActive: true,
  createdBy: "",
  published: false,
}; 