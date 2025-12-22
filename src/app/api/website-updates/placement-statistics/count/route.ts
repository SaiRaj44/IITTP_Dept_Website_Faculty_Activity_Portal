import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import PlacementStatistics from "@/app/models/website/placement-statistics";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const academicYear = url.searchParams.get("academicYear");
    const batch = url.searchParams.get("batch");
    const category = url.searchParams.get("category");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");

    // Build the filter query
    const filterQuery: Record<string, unknown> = { 
      createdBy: session.user.email 
    };

    if (academicYear) {
      filterQuery.academicYear = { $regex: academicYear, $options: "i" };
    }

    if (batch) {
      filterQuery.batch = { $regex: batch, $options: "i" };
    }

    if (category) {
      filterQuery.category = category;
    }

    if (published) {
      filterQuery.published = published === "true";
    }

    // Handle search
    if (query) {
      filterQuery.$or = [
        { academicYear: { $regex: query, $options: "i" } },
        { batch: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ];
    }

    // Count the records with the filter
    const count = await PlacementStatistics.countDocuments(filterQuery);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting placement statistics:", error);
    return NextResponse.json(
      { error: "Failed to count placement statistics" },
      { status: 500 }
    );
  }
} 