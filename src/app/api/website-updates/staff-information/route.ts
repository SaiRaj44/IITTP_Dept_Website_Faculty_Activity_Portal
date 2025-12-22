import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import StaffInformation from "@/app/models/website/staff-information";

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
      const staff = await StaffInformation.findOne({
        _id: id,
        createdBy: session.user.email,
      });

      if (!staff) {
        return NextResponse.json(
          { success: false, error: "Staff information not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: staff });
    }

    const staffList = await StaffInformation.find({
      createdBy: session.user.email,
    }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: staffList });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch staff information",
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
      imageUrl: !!body.imageUrl
    });

    // Validate required fields
    if (!body.name || !body.designation || !body.category || !body.email || !body.imageUrl) {
      console.log("Missing required fields detected");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    // Create the staff information
    const staff = await StaffInformation.create({
      ...body,
      createdBy: session.user.email,
    });

    console.log("Created staff information:", staff);
    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create staff information",
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
        { success: false, error: "Missing staff ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Received PUT body:", body);

    // Validate required fields
    if (!body.name || !body.designation || !body.category || !body.email || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
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

    const existingStaff = await StaffInformation.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: "Staff information not found" },
        { status: 404 }
      );
    }

    const updatedStaff = await StaffInformation.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    console.log("Updated staff information:", updatedStaff);
    return NextResponse.json({ success: true, data: updatedStaff });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update staff information",
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
        { success: false, error: "Missing staff ID" },
        { status: 400 }
      );
    }

    const staff = await StaffInformation.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Staff information not found" },
        { status: 404 }
      );
    }

    await StaffInformation.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete staff information",
      },
      { status: 500 }
    );
  }
} 