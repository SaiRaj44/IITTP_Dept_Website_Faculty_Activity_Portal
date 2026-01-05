import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import SliderImage from "@/app/models/website/slider-images";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await SliderImage.countDocuments({ createdBy: session.user.email });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching slider image count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
} 