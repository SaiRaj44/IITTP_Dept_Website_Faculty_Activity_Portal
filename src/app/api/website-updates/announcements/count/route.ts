import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import Announcement from "@/app/models/website/announcements";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await Announcement.countDocuments({ createdBy: session.user.email });
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching announcement count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
} 