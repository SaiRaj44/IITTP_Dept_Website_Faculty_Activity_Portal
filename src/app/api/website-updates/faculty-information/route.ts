import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import FacultyInformation from "@/app/models/website/faculty-information";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const faculty = await FacultyInformation.findOne({
        _id: id,
        createdBy: session.user.email,
      });

      if (!faculty) {
        return NextResponse.json(
          { success: false, error: "Faculty information not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: faculty });
    }

    const facultyList = await FacultyInformation.find({
      createdBy: session.user.email,
    }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: facultyList });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch faculty information",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("Received POST body:", body);
    
    // Debug: log required fields individually to see what's missing
    console.log("Required fields check:", {
      name: !!body.name,
      designation: !!body.designation, 
      category: !!body.category,
      email: !!body.email,
      imageUrl: !!body.imageUrl,
      researchInterests: !!body.researchInterests,
      education: !!body.education
    });

    // Validate required fields
    if (!body.name || !body.designation || !body.category || !body.email || !body.imageUrl || !body.researchInterests || !body.education) {
      console.log("Missing required fields detected");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate profileUrl format (should be a slug, not a full URL)
    if (body.profileUrl && (body.profileUrl.startsWith('http') || body.profileUrl.includes('://'))) {
      return NextResponse.json(
        { success: false, error: "Profile URL should be a slug (e.g., 'dr-john-doe'), not a full URL" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create the faculty information
    const faculty = await FacultyInformation.create({
      ...body,
      createdBy: session.user.email,
    });

    console.log("Created faculty information:", faculty);
    return NextResponse.json({ success: true, data: faculty });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create faculty information",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing faculty ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Received PUT body:", body);

    // Validate required fields
    if (!body.name || !body.designation || !body.category || !body.email || !body.imageUrl || !body.researchInterests) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate profileUrl format (should be a slug, not a full URL)
    if (body.profileUrl && (body.profileUrl.startsWith('http') || body.profileUrl.includes('://'))) {
      return NextResponse.json(
        { success: false, error: "Profile URL should be a slug (e.g., 'dr-john-doe'), not a full URL" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const existingFaculty = await FacultyInformation.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!existingFaculty) {
      return NextResponse.json(
        { success: false, error: "Faculty information not found" },
        { status: 404 }
      );
    }

    const updatedFaculty = await FacultyInformation.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    console.log("Updated faculty information:", updatedFaculty);
    return NextResponse.json({ success: true, data: updatedFaculty });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update faculty information",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing faculty ID" },
        { status: 400 }
      );
    }

    const faculty = await FacultyInformation.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!faculty) {
      return NextResponse.json(
        { success: false, error: "Faculty information not found" },
        { status: 404 }
      );
    }

    await FacultyInformation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete faculty information",
      },
      { status: 500 }
    );
  }
} 