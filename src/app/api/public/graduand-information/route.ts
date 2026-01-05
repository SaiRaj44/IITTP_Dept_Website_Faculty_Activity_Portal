import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import GraduandInformation from "@/app/models/website/graduands-information";

// Define the type for the filter query
interface FilterQuery {
  year?: string;
  category?: string;
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const year = url.searchParams.get("year");
    const query = url.searchParams.get("query");
    const limit = parseInt(url.searchParams.get("limit") || "30", 10);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    // Base filter
    const baseFilter: FilterQuery = {};

    // Category and year filters
    const filterQuery: FilterQuery = {
      ...baseFilter,
      ...(category && { category }),
      ...(year && { year }),
    };

    // Search query
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { rollNumber: { $regex: query, $options: "i" } },
      ];
    }

    // Get all counts in parallel
    const [graduands, total, totalBTech, totalMTech] = await Promise.all([
      GraduandInformation.find(filterQuery)
        .select("name rollNumber category year achievements imageUrl")
        .sort({ batch:-1 })
        // .sort({ rollNumber: 1, name: 1 })
        .skip(skip)
        .limit(limit),
      GraduandInformation.countDocuments(filterQuery),
      GraduandInformation.countDocuments({ ...baseFilter, category: "B.Tech" }),
      GraduandInformation.countDocuments({ ...baseFilter, category: "M.Tech" }),
    ]);

    return NextResponse.json({
      success: true,
      data: graduands,
      stats: {
        total,
        totalBTech,
        totalMTech,
      },
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching graduand information:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch graduand information" },
      { status: 500 }
    );
  }
}
