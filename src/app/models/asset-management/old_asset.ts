import mongoose, { Document } from "mongoose";

// Define interface for the document context in validators
interface AssetDocument extends Document {
  category: string;
  subcategory: string;
}

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

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
        validator: function(this: AssetDocument, v: string): boolean {
          const category = this.get("category");
          return subcategories[category as keyof typeof subcategories].includes(
            v
          );
        },
        message: "Invalid subcategory for the selected category",
      },
    },
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    warrantyPeriod: {
      years: {
        type: Number,
        default: 0,
        min: 0,
      },
      months: {
        type: Number,
        default: 0,
        min: 0,
        max: 11,
      },
    },
    warrantyExpiryDate: {
      type: Date,
      required: true,
    },
    currentCondition: {
      type: String,
      required: true,
      enum: ["Excellent", "Good", "Fair", "Poor", "NeedsRepair"],
    },
    custodian: {
      type: String,
      trim: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        name: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileType: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["Active", "In Repair", "Retired", "Lost/Stolen"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for full warranty period string
assetSchema.virtual("warrantyPeriodString").get(function () {
  const years = this.warrantyPeriod?.years || 0;
  const months = this.warrantyPeriod?.months || 0;
  let result = "";
  if (years > 0) {
    result += `${years} year${years > 1 ? "s" : ""}`;
  }
  if (months > 0) {
    if (result) result += " and ";
    result += `${months} month${months > 1 ? "s" : ""}`;
  }
  return result || "No warranty";
});

// Pre-save middleware to calculate warranty expiry date
assetSchema.pre("save", function (next) {
  if (
    this.isModified("purchaseDate") ||
    this.isModified("warrantyPeriod.years") ||
    this.isModified("warrantyPeriod.months")
  ) {
    if (this.purchaseDate && this.warrantyPeriod) {
      const expiryDate = new Date(this.purchaseDate);
      expiryDate.setFullYear(
        expiryDate.getFullYear() + (this.warrantyPeriod.years || 0)
      );
      expiryDate.setMonth(expiryDate.getMonth() + (this.warrantyPeriod.months || 0));
      this.warrantyExpiryDate = expiryDate;
    }
  }
  next();
});

// Export subcategories for use in the frontend
export { subcategories };

const Asset = mongoose.models.Asset || mongoose.model("Asset", assetSchema);

export default Asset;
