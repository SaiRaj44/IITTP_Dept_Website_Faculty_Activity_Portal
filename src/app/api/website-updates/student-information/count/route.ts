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
    const year = url.searchParams.get("year");
    const category = url.searchParams.get("category");
    const branch = url.searchParams.get("branch");
    const query = url.searchParams.get("query");
    const published = url.searchParams.get("published");

    // Build the filter query
    const filterQuery: Record<string, unknown> = { 
      createdBy: session.user.email 
    };

    if (year) {
      filterQuery.year = year;
    }

    if (category) {
      filterQuery.category = category;
    }

    if (branch) {
      filterQuery.branch = { $regex: branch, $options: "i" };
    }

    if (published) {
      filterQuery.published = published === "true";
    }

    // Handle search
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { rollNumber: { $regex: query, $options: "i" } }
      ];
    }

    // Count the records with the filter
    const count = await StudentInformation.countDocuments(filterQuery);

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting student information:", error);
    return NextResponse.json(
      { error: "Failed to count student information" },
      { status: 500 }
    );
  }
} 