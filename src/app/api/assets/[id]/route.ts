import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Asset from "@/app/models/asset-management/assets";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    await connectMongoDB();

    if (id) {
      const asset = await Asset.findOne({
        _id: id,
        createdBy: session.user.email,
      })
        .populate("vendorId", "vendorName contactPerson email phone")
        .populate("locationId", "locationName address");

      if (!asset) {
        return NextResponse.json(
          { success: false, error: "Asset not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: asset });
    }

    return NextResponse.json(
      { success: false, error: "Missing asset ID" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching asset:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching asset" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing asset ID" },
        { status: 400 }
      );
    }

    const assetData = await request.json();
    await connectMongoDB();

    // Calculate warranty expiry date if warranty period is updated
    if (assetData.warrantyPeriod || assetData.purchaseDate) {
      const asset = await Asset.findById(id);
      if (asset) {
        const purchaseDate = assetData.purchaseDate || asset.purchaseDate;
        const warrantyPeriod = {
          years:
            assetData.warrantyPeriod?.years !== undefined
              ? assetData.warrantyPeriod.years
              : asset.warrantyPeriod.years,
          months:
            assetData.warrantyPeriod?.months !== undefined
              ? assetData.warrantyPeriod.months
              : asset.warrantyPeriod.months,
        };

        const expiryDate = new Date(purchaseDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + warrantyPeriod.years);
        expiryDate.setMonth(expiryDate.getMonth() + warrantyPeriod.months);
        assetData.warrantyExpiryDate = expiryDate;
      }
    }

    const updatedAsset = await Asset.findOneAndUpdate(
      { _id: id, createdBy: session.user.email },
      {
        ...assetData,
        updatedBy: session.user.email,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("vendorId", "vendorName contactPerson email phone")
      .populate("locationId", "locationName address");

    if (!updatedAsset) {
      return NextResponse.json(
        { success: false, error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedAsset });
  } catch (error) {
    console.error("Error updating asset:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error updating asset",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing asset ID" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const deletedAsset = await Asset.findOneAndDelete({
      _id: id,
      createdBy: session.user.email,
    });

    if (!deletedAsset) {
      return NextResponse.json(
        { success: false, error: "Asset not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Asset deleted successfully",
      data: deletedAsset,
    });
  } catch (error) {
    console.error("Error deleting asset:", error);
    return NextResponse.json(
      { success: false, error: "Error deleting asset" },
      { status: 500 }
    );
  }
}
