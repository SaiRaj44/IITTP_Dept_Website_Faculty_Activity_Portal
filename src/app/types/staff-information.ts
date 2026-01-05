// Types for staff information
export interface StaffInformation {
  _id: string;
  category: "Technical" | "Non Technical";
  name: string;
  designation: string;
  email: string;
  imageUrl: string;
  PhD?: string;
  areas?: string;
  office?: string;
  order: number;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Default empty state for staff information
export const emptyStaffInformation: Omit<StaffInformation, "_id" | "createdAt" | "updatedAt"> = {
  category: "Technical",
  name: "",
  designation: "",
  email: "",
  imageUrl: "",
  PhD: "",
  areas: "",
  office: "",
  order: 0,
  createdBy: "",
  published: false,
}; 