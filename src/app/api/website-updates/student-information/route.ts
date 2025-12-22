import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import StudentInformation from "@/app/models/website/student-information";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const name = url.searchParams.get("name");
    const rollNumber = url.searchParams.get("rollNumber");
    const year = url.searchParams.get("year");
    const category = url.searchParams.get("category");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Single item lookup by ID
    if (id) {
      const item = await StudentInformation.findOne({
        _id: id,
        createdBy: session.user.email,
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
      createdBy: session.user.email,
    };

    if (name) {
      filterQuery.name = { $regex: name, $options: "i" };
    }

    if (rollNumber) {
      filterQuery.rollNumber = { $regex: rollNumber, $options: "i" };
    }

    if (year) {
      filterQuery.year = year;
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
        { branch: { $regex: query, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const total = await StudentInformation.countDocuments(filterQuery);

    // Fetch items with pagination and sorting
    const items = await StudentInformation.find(filterQuery)
      .sort({ year: 1, category: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching student information:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      },
      { status: 500 }
    );
  }
}

// Use the generic handler for other methods
import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";

const handler = createActivityHandler({
  Model: StudentInformation,
  searchFields: ["name", "rollNumber", "year", "category", "branch"],
  defaultSort: { year: 1, category: 1, name: 1 },
});

export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
