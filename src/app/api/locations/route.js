import { NextResponse } from "next/server";
// import dbConnect from '../../../../utils/dbConnect';
import connectMongoDB from "@/app/lib/mongodb";
import Location from "../../models/asset-management/Location";

export async function GET() {
  try {
    await connectMongoDB();
    const locations = await Location.find({});
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const body = await request.json();
    const location = await Location.create(body);
    return NextResponse.json(
      { success: true, data: location },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in GET /api/assets:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create location" },
      { status: 500 }
    );
  }
}
