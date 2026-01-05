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
    const id = url.searchParams.get("id");
    const academicYear = url.searchParams.get("academicYear");
    const batch = url.searchParams.get("batch");
    const category = url.searchParams.get("category");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Single item lookup by ID
    if (id) {
      const item = await PlacementStatistics.findOne({
        _id: id,
        createdBy: session.user.email
      });

      if (!item) {
        return NextResponse.json(
          { success: false, error: "Item not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: [item] });
    }

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

    // Get total count for pagination
    const total = await PlacementStatistics.countDocuments(filterQuery);

    // Fetch items with pagination and sorting
    const items = await PlacementStatistics.find(filterQuery)
      .sort({ academicYear: -1, category: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching placement statistics:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch data" 
      },
      { status: 500 }
    );
  }
}

// Use the generic handler for other methods
import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";

const handler = createActivityHandler({
  Model: PlacementStatistics,
  searchFields: ["academicYear", "batch", "category"],
  defaultSort: { academicYear: -1, category: -1 }
});

export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
