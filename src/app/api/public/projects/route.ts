import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import Project from "@/app/models/activity-portal/projects";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build the filter query
    const filterQuery: Record<string, unknown> = {
      published: true,
    };

    if (category) {
      filterQuery.category = category;
    }

    if (year) {
      filterQuery.year = year;
    }

    // Get all unique categories and years first
    const categories = await Project.distinct("category", { published: true });
    const years = await Project.distinct("year", { published: true });

    // Sort years in descending order
    const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));

    // Fetch projects with pagination
    const projects = await Project.find(filterQuery)
      .sort({ date: -1 })
      .populate("facultyInvolved")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Project.countDocuments(filterQuery);

    return NextResponse.json({
      data: projects,
      filters: {
        category: categories,
        year: sortedYears,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
