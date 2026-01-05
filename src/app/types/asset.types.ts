// Define asset categories and subcategories
export const assetCategories = {
  Furniture: ["Chair", "Desk", "Cabinet", "Table", "Shelf"],
  Laptop: ["Business", "Workstation", "Gaming", "Ultrabook", "MacBook"],
  Peripherals: ["Keyboard", "Mouse", "Monitor", "Webcam", "Headset", "Speaker"],
  Printer: [
    "Laser Printer",
    "Inkjet Printer",
    "3D Printer",
    "Multi-Function Printer",
  ],
  Servers: ["Rack Server", "Tower Server"],
  Software: [
    "Operating System",
    "Office Suite",
    "Design Software",
    "Development Tools",
    "Security Software",
  ],
  Systems: ["Desktop", "All-In-One", "Workstation", "iPad"],
} as const;

export type AssetCategory = keyof typeof assetCategories;
export type AssetSubcategory<T extends AssetCategory> =
  (typeof assetCategories)[T][number];

export interface IAsset {
  _id: string;
  assetId: string;
  category: AssetCategory;
  subcategory: string;
  assetName: string;
  brand: string;
  serialNumber: string;
  purchaseNumber: string;
  source:
    | "Institute Fund"
    | "Department Budget"
    | "Project Fund"
    | "CPDA"
    | "NFSUG"
    | "NFG"
    | "Others";
  purchaseDate: string;
  purchasePrice: number;
  vendorId: {
    _id: string;
    vendorName: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  warrantyPeriod: {
    years: number;
    months: number;
  };
  warrantyExpiryDate: string;
  currentCondition: "Excellent" | "Good" | "Fair" | "Poor" | "NeedsRepair";
  custodian?: string;
  assginedTo?: string;
  allotMode?: string;
  locationId: {
    _id: string;
    locationName: string;
    address: string;
  };
  remarks?: string;
  attachments?: Array<{
    name: string;
    fileUrl: string;
    fileType: string;
  }>;
  status: "Active" | "In Repair" | "Disposed" | "Lost";
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAssetFormData
  extends Omit<IAsset, "vendorId" | "locationId"> {
  vendorId: string;
  locationId: string;
  attachment?: File | null;
}
