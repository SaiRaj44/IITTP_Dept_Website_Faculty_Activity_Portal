import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Vendor from "@/app/models/asset-management/vendor";

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop(); // extract id from URL

    const vendor = await Vendor.findById(id);
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error("GET /api/vendors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch vendor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const body = await request.json();
    const vendor = await Vendor.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error("PUT /api/vendors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return NextResponse.json(
        { success: false, error: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("DELETE /api/vendors/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete vendor" },
      { status: 500 }
    );
  }
}
