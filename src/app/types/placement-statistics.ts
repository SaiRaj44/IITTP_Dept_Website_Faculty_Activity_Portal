export interface ProgramStatistics {
  registeredCount: number;
  placedCount: number;
  totalOffers: number;
  highestPackage: number;
  lowestPackage: number;
  averagePackage: number;
  medianPackage: number;
}

export interface PlacementStatistics {
  _id?: string;
  academicYear: string;
  batch: string;
  btech: ProgramStatistics;
  mtech: ProgramStatistics;
  isPublished: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export const defaultProgramStatistics: ProgramStatistics = {
  registeredCount: 0,
  placedCount: 0,
  totalOffers: 0,
  highestPackage: 0,
  lowestPackage: 0,
  averagePackage: 0,
  medianPackage: 0,
}; 