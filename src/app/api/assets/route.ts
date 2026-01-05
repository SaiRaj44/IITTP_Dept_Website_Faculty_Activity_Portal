import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Asset from "@/app/models/asset-management/assets";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vendor from "@/app/models/asset-management/vendor";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Helper function to save file
async function saveFile(file: File, assetId: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create directory if it doesn't exist
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "asset-management",
    assetId
  );
  await mkdir(uploadDir, { recursive: true });

  // Save the file
  const filePath = path.join(uploadDir, file.name);
  await writeFile(filePath, buffer);

  // Return the public URL
  return `/asset-management/${assetId}/${file.name}`;
}

// Define interfaces
interface WarrantyPeriod {
  years: number;
  months: number;
}

interface Attachment {
  name: string;
  fileUrl: string;
  fileType: string;
}

interface AssetData {
  assetName?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  serialNumber?: string;
  purchaseDate?: string;
  vendorId?: string;
  locationId?: string;
  warrantyPeriod?: WarrantyPeriod;
  purchasePrice?: number;
  notes?: string;
  createdBy?: string;
  assetId?: string;
  attachments?: Attachment[];
  warrantyExpiryDate?: string;
  file?: File;
  updatedBy?: string;
  status?: string; // Added status field
  // Additional required fields from Asset model
  purchaseNumber?: string;
  source?: string;
  currentCondition?: string;
  custodian?: string;
  assginedTo?: string; // Note: keeping the typo to match the model
}

// Type for string fields in AssetData
type AssetStringFields =
  | "assetName"
  | "category"
  | "subcategory"
  | "brand"
  | "serialNumber"
  | "purchaseDate"
  | "vendorId"
  | "locationId"
  | "notes"
  | "createdBy"
  | "assetId"
  | "updatedBy"
  | "purchaseNumber"
  | "source"
  | "currentCondition"
  | "custodian"
  | "assginedTo";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    const assets = await Asset.find({})
      .populate("vendorId", "vendorName")
      .populate("locationId", "address")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    // Handle FormData
    const formData = await request.formData();
    const data: AssetData = {};

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      if (key === "warrantyPeriod") {
        data.warrantyPeriod = JSON.parse(value as string) as WarrantyPeriod;
      } else if (key === "purchasePrice") {
        data.purchasePrice = parseFloat(value as string);
      } else if (key === "attachment") {
        data.file = value as File;
      } else if (isAssetStringField(key)) {
        // Type-safe assignment for string fields
        data[key as AssetStringFields] = value as string;
      }
    }

    // Validate required fields
    const requiredFields: AssetStringFields[] = [
      "assetName",
      "category",
      "subcategory",
      "brand",
      "serialNumber",
      "purchaseDate",
      "vendorId",
      "locationId",
      "purchaseNumber",
      "source",
      "currentCondition",
      "custodian",
      "assginedTo",
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    // Also validate numeric and object fields
    const validationErrors: string[] = [];

    if (missingFields.length > 0) {
      validationErrors.push(
        `Missing required fields: ${missingFields.join(", ")}`
      );
    }

    if (!data.purchasePrice || data.purchasePrice <= 0) {
      validationErrors.push(
        "purchasePrice is required and must be greater than 0"
      );
    }

    if (
      !data.warrantyPeriod ||
      (data.warrantyPeriod.years === undefined &&
        data.warrantyPeriod.months === undefined)
    ) {
      validationErrors.push("warrantyPeriod is required (years and months)");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: validationErrors.join("; "),
        },
        { status: 400 }
      );
    }

    // Add user information to the asset data
    data.createdBy = session.user?.email || "unknown";

    // Generate asset ID if not provided
    if (!data.assetId) {
      const latestAsset = await Asset.findOne().sort({ createdAt: -1 });
      const lastNumber = latestAsset
        ? parseInt(latestAsset.assetId.split("-")[1])
        : 0;
      data.assetId = `AST-${String(lastNumber + 1).padStart(5, "0")}`;
    }

    // Save the file physically
    if (data.file) {
      const fileUrl = await saveFile(data.file, data.assetId);
      data.attachments = [
        {
          name: data.file.name,
          fileUrl: fileUrl,
          fileType: data.file.type,
        },
      ];
      // Remove temporary file property
      delete data.file;
    }

    // Calculate warranty expiry date
    const purchaseDate = new Date(data.purchaseDate!);
    const warrantyYears = data.warrantyPeriod?.years || 0;
    const warrantyMonths = data.warrantyPeriod?.months || 0;

    const warrantyExpiryDate = new Date(purchaseDate);
    warrantyExpiryDate.setFullYear(
      warrantyExpiryDate.getFullYear() + warrantyYears
    );
    warrantyExpiryDate.setMonth(warrantyExpiryDate.getMonth() + warrantyMonths);

    data.warrantyExpiryDate = warrantyExpiryDate.toISOString();

    // Create the asset with attachments
    const asset = await Asset.create(data);

    return NextResponse.json({
      success: true,
      message: "Asset created successfully",
      data: asset,
    });
  } catch (error: unknown) {
    console.error("Error in POST /api/assets:", error);
    let errorMessage = "Failed to create asset";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("validation failed")) {
        errorMessage = "Validation failed: Please check your input data";
        statusCode = 400;
      } else if (error.message.includes("duplicate key")) {
        errorMessage = "An asset with this ID already exists";
        statusCode = 409;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectMongoDB();

    // Handle FormData
    const formData = await request.formData();
    const updateData: AssetData = {};
    let id: string | null = null;
    let file: File | null = null;

    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      if (key === "_id") {
        id = value as string;
        continue;
      }

      switch (key) {
        case "warrantyPeriod":
          updateData.warrantyPeriod = JSON.parse(
            value as string
          ) as WarrantyPeriod;
          break;
        case "purchasePrice":
          updateData.purchasePrice = parseFloat(value as string);
          break;
        case "attachment":
          file = value as File;
          break;
        case "status":
          updateData.status = value as string;
          break;
        default:
          if (isAssetStringField(key)) {
            // Type-safe assignment for string fields
            updateData[key as AssetStringFields] = value as string;
          }
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Asset ID is required" },
        { status: 400 }
      );
    }

    // Add user information
    updateData.updatedBy = session.user?.email || "unknown";

    // Find existing asset to get current data
    const existingAsset = await Asset.findById(id);
    if (!existingAsset) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    // Handle file upload if present
    if (file && file.name) {
      const fileUrl = await saveFile(file, id);
      updateData.attachments = [
        {
          name: file.name,
          fileUrl: fileUrl,
          fileType: file.type,
        },
      ];
    }

    // Calculate warranty expiry date if warranty period or purchase date is updated
    if (updateData.warrantyPeriod || updateData.purchaseDate) {
      const purchaseDate = new Date(
        updateData.purchaseDate || existingAsset.purchaseDate
      );
      const warrantyYears =
        updateData.warrantyPeriod?.years ||
        existingAsset.warrantyPeriod?.years ||
        0;
      const warrantyMonths =
        updateData.warrantyPeriod?.months ||
        existingAsset.warrantyPeriod?.months ||
        0;

      const warrantyExpiryDate = new Date(purchaseDate);
      warrantyExpiryDate.setFullYear(
        warrantyExpiryDate.getFullYear() + warrantyYears
      );
      warrantyExpiryDate.setMonth(
        warrantyExpiryDate.getMonth() + warrantyMonths
      );

      updateData.warrantyExpiryDate = warrantyExpiryDate.toISOString();
    }

    // If no new attachment is provided, keep the existing attachments
    if (!updateData.attachments && existingAsset.attachments) {
      updateData.attachments = existingAsset.attachments;
    }

    try {
      // Update the asset
      const updatedAsset = await Asset.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate([
        { path: "vendorId", select: "vendorName" },
        { path: "locationId", select: "locationName" },
      ]);

      if (!updatedAsset) {
        return NextResponse.json(
          { success: false, error: "Asset not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: updatedAsset });
    } catch (error: unknown) {
      console.error("Error in PUT /api/assets:", error);
      let errorMessage = "Failed to update asset";
      let statusCode = 500;

      // Define interface for Mongoose validation error
      interface MongooseValidationError extends Error {
        errors: Record<string, { message: string }>;
      }

      if (error instanceof Error && error.name === "ValidationError") {
        const validationError = error as MongooseValidationError;
        errorMessage = Object.values(validationError.errors)
          .map((err) => err.message)
          .join(", ");
        statusCode = 400;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: statusCode }
      );
    }
  } catch (error: unknown) {
    console.error("Error in PUT /api/assets:", error);
    let errorMessage = "Failed to update asset";
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes("validation failed")) {
        errorMessage = "Validation failed: Please check your input data";
        statusCode = 400;
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Asset ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const asset = await Asset.findByIdAndDelete(id);

    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}

// Type guard to check if a string is a valid AssetStringField
function isAssetStringField(key: string): key is AssetStringFields {
  const validKeys: AssetStringFields[] = [
    "assetName",
    "category",
    "subcategory",
    "brand",
    "serialNumber",
    "purchaseDate",
    "vendorId",
    "locationId",
    "notes",
    "createdBy",
    "assetId",
    "updatedBy",
    "purchaseNumber",
    "source",
    "currentCondition",
    "custodian",
    "assginedTo",
  ];
  return validKeys.includes(key as AssetStringFields);
}
