import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import GraduandsInformation from "@/app/models/website/graduands-information";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const batch = url.searchParams.get("batch");
    const category = url.searchParams.get("category");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");

    // Build the filter query
    const filterQuery: Record<string, unknown> = { 
      createdBy: session.user.email 
    };

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
        { name: { $regex: query, $options: "i" } },
        { rollNumber: { $regex: query, $options: "i" } },
        { company: { $regex: query, $options: "i" } }
      ];
    }

    // Count the records with the filter
    const count = await GraduandsInformation.countDocuments(filterQuery);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting graduands information:", error);
    return NextResponse.json(
      { error: "Failed to count graduands information" },
      { status: 500 }
    );
  }
} 