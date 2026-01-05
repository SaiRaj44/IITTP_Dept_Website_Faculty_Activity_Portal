import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import FacultyInformation from "@/app/models/website/faculty-information";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const designation = url.searchParams.get("designation");
    const category = url.searchParams.get("category");
    const query = url.searchParams.get("query");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build the filter query - only show published and active items
    const filterQuery: Record<string, unknown> = {
      published: true,
      isActive: true,
    };

    // Handle category filter (Professor, Associate Professor, Assistant Professor)
    if (category && category !== "all") {
      filterQuery.designation = category;
    }

    if (name) {
      filterQuery.name = { $regex: name, $options: "i" };
    }

    if (designation) {
      filterQuery.designation = designation;
    }

    // Handle search
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { designation: { $regex: query, $options: "i" } },
        { researchInterests: { $regex: query, $options: "i" } },
      ];
    }

    // Fetch faculty with pagination and sorting by order
    const faculty = await FacultyInformation.find(filterQuery)
      .sort({ order: 1, designation: 1, name: 1 }) // Sort by order, then designation, then name
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await FacultyInformation.countDocuments(filterQuery);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      data: faculty,
      pagination: {
        total,
        page,
        limit,
        pages: totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching public faculty information:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty information" },
      { status: 500 }
    );
  }
}
