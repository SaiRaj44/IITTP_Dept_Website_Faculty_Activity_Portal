import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodb";
import Location from "../../../models/asset-management/Location";

export async function GET(request, { params }) {
  try {
    await connectMongoDB();
    const location = await Location.findById(params.id);
    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const location = await Location.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: location });
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update location" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectMongoDB();
    const location = await Location.findByIdAndDelete(params.id);
    if (!location) {
      return NextResponse.json(
        { success: false, error: "Location not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete location" },
      { status: 500 }
    );
  }
}
