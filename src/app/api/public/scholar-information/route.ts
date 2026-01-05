import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import ScholarInformation from "@/app/models/website/scholar-information";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const domain = url.searchParams.get("domain");
    const guide = url.searchParams.get("guide");
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");
    const batch = url.searchParams.get("batch");
    const query = url.searchParams.get("query");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build the filter query - only show published and active items
    const filterQuery: Record<string, unknown> = {
      published: true,
      isActive: true,
    };

    if (name) {
      filterQuery.name = { $regex: name, $options: "i" };
    }

    if (domain) {
      filterQuery.domain = { $regex: domain, $options: "i" };
    }

    // Updated guide filter to search facultyInvolved names
    if (guide) {
      filterQuery["facultyInvolved.name"] = { $regex: guide, $options: "i" };
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

    // Handle search across multiple fields including faculty names
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { domain: { $regex: query, $options: "i" } },
        { "facultyInvolved.name": { $regex: query, $options: "i" } },
      ];
    }

    // Fetch scholars with pagination
    const scholars = await ScholarInformation.find(filterQuery)
      .sort({ email: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await ScholarInformation.countDocuments(filterQuery);

    return NextResponse.json({
      data: scholars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public scholar information:", error);
    return NextResponse.json(
      { error: "Failed to fetch scholar information" },
      { status: 500 }
    );
  }
}