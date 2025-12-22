import {  NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import FacultyInformation from "@/app/models/website/faculty-information";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await FacultyInformation.countDocuments({ createdBy: session.user.email });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching faculty information count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
} 