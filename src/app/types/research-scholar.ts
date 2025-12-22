// Types for research scholars information
export interface ResearchScholar {
  _id: string;
  category: "PhD Regular" | "PhD External" | "MS Regular";
  name: string;
  supervisor: string;
  email: string;
  imageUrl: string;
  researchArea?: string;
  joinedYear?: string;
  thesis?: string;
  publications?: string;
  linkedin?: string;
  github?: string;
  personalWebsite?: string;
  order: number;
  createdBy: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Default empty state for research scholar information
export const emptyResearchScholar: Omit<ResearchScholar, "_id" | "createdAt" | "updatedAt"> = {
  category: "PhD Regular",
  name: "",
  supervisor: "",
  email: "",
  imageUrl: "",
  researchArea: "",
  joinedYear: "",
  thesis: "",
  publications: "",
  linkedin: "",
  github: "",
  personalWebsite: "",
  order: 0,
  createdBy: "",
  published: false,
}; 