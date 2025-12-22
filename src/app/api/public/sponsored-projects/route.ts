import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import SponsoredProjects from "@/app/models/activity-portal/sponsored";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Build the filter query
    const filterQuery: Record<string, unknown> = {
      published: true,
    };

    if (status) {
      filterQuery.status = status;
    }

    // Get all unique statuses first
    const statuses = await SponsoredProjects.distinct("status", {
      published: true,
    });

    // Fetch projects with pagination - sort by status (Ongoing first) and then by date
    const projects = await SponsoredProjects.find(filterQuery)
      .sort({ status: "desc", date: "desc" })
      .populate("facultyInvolved")
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await SponsoredProjects.countDocuments(filterQuery);

    return NextResponse.json({
      data: projects,
      filters: {
        status: statuses,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sponsored projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch sponsored projects" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
