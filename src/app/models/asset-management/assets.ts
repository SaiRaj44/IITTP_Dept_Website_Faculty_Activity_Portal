"use server";

import mongoose from "mongoose";
import { IAsset } from "@/app/types/asset.types";

// Define subcategories for each category
const subcategories = {
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
};

const assetSchema = new mongoose.Schema<IAsset>(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
      enum: Object.keys(subcategories),
    },
    subcategory: {
      type: String,
      required: true,
      validate: {
        validator: function (this: mongoose.Document & IAsset, value: string) {
          return subcategories[this.category]?.includes(value);
        },
        message: "Subcategory must be valid for the selected category",
      },
    },
    assetName: { type: String, required: true },
    brand: { type: String, required: true },
    serialNumber: { type: String, required: true },
    purchaseNumber: { type: String, required: true },
    source: {
      type: String,
      required: true,
      enum: [
        "Institute Fund",
        "Department Budget",
        "Project Fund",
        "CPDA",
        "NFSUG",
        "NFG",
        "Others",
      ],
    },
    purchaseDate: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    warrantyPeriod: {
      years: { type: Number, required: true, default: 0 },
      months: { type: Number, required: true, default: 0 },
    },
    warrantyExpiryDate: { type: String, required: true },
    currentCondition: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Fair", "Poor", "NeedsRepair"],
    },
    custodian: { type: String, required: true },
    assginedTo: { type: String, required: true },
    allotMode: { type: String, default: "Direct" },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    remarks: { type: String },
    attachments: [
      {
        name: String,
        fileUrl: String,
        fileType: String,
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["Active", "In Repair", "Disposed", "Lost"],
      default: "Active",
    },
    createdBy: { type: String, required: true },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate warranty expiry date
assetSchema.pre("save", function (next) {
  if (this.isModified("purchaseDate") || this.isModified("warrantyPeriod")) {
    const purchaseDate = new Date(this.purchaseDate);
    purchaseDate.setFullYear(
      purchaseDate.getFullYear() + this.warrantyPeriod.years
    );
    purchaseDate.setMonth(purchaseDate.getMonth() + this.warrantyPeriod.months);
    this.warrantyExpiryDate = purchaseDate.toISOString().split("T")[0];
  }
  next();
});

// Export the model
const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);
export default Asset;
