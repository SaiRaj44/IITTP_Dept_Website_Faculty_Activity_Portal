import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import ScholarInformation from "@/app/models/website/scholar-information";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const domain = url.searchParams.get("domain");
    const guide = url.searchParams.get("guide");
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");
    const batch = url.searchParams.get("batch");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");
    const isActive = url.searchParams.get("isActive");

    // Build the filter query
    const filterQuery: Record<string, unknown> = { 
      createdBy: session.user.email 
    };

    if (name) {
      filterQuery.name = { $regex: name, $options: "i" };
    }

    if (domain) {
      filterQuery.domain = { $regex: domain, $options: "i" };
    }

    if (guide) {
      filterQuery.guide = { $regex: guide, $options: "i" };
    }

    if (category) {
      filterQuery.category = category;
    }

    if (year) {
      filterQuery.year = year;
    }

    if (batch) {
      filterQuery.batch = { $regex: batch, $options: "i" };
    }

    if (published) {
      filterQuery.published = published === "true";
    }

    if (isActive) {
      filterQuery.isActive = isActive === "true";
    }

    // Handle search
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { domain: { $regex: query, $options: "i" } },
        { guide: { $regex: query, $options: "i" } }
      ];
    }

    // Count the records with the filter
    const count = await ScholarInformation.countDocuments(filterQuery);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting scholar information:", error);
    return NextResponse.json(
      { error: "Failed to count scholar information" },
      { status: 500 }
    );
  }
} 