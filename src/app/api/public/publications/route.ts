import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Publication from "@/app/models/activity-portal/publications";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");
    const faculty = url.searchParams.get("faculty");
    const query = url.searchParams.get("query");
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build the filter query - only show published items
    const filterQuery: Record<string, unknown> = {
      published: true,
    };

    if (category) {
      filterQuery.category = category;
    }

    if (year) {
      filterQuery.year = year;
    }

    if (faculty) {
      filterQuery["facultyInvolved._id"] = faculty;
    }

    // Handle search
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { journal_name: { $regex: query, $options: "i" } },
      ];
    }

    // Fetch publications with pagination
    const publications = await Publication.find(filterQuery)
      .sort({ year: -1, createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Publication.countDocuments(filterQuery);

    // Get all unique categories for filters
    const categories = await Publication.distinct("category", {
      published: true,
    });

    return NextResponse.json({
      data: publications,
      filters: {
        category: categories,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching public publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
