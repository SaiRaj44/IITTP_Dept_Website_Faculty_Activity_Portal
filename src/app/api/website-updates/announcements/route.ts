import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import Announcement from "@/app/models/website/announcements";

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
      const announcement = await Announcement.findOne({
        _id: id,
        createdBy: session.user.email,
      });

      if (!announcement) {
        return NextResponse.json(
          { success: false, error: "Announcement not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: announcement });
    }

    const announcements = await Announcement.find({
      createdBy: session.user.email,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch announcements",
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

    // Validate required fields
    if (!body.title || !body.content || !body.startDate || !body.endDate || !body.category || !body.priority) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["general", "academic", "event", "news"];
    if (!validCategories.includes(body.category.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "normal", "high", "urgent"];
    if (!validPriorities.includes(body.priority.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid priority" },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { success: false, error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Normalize the data
    const normalizedData = {
      ...body,
      category: body.category.toLowerCase(),
      priority: body.priority.toLowerCase(),
      createdBy: session.user.email,
    };

    console.log("Creating announcement with data:", normalizedData);
    const announcement = await Announcement.create(normalizedData);
    console.log("Created announcement:", announcement);

    return NextResponse.json({ success: true, data: announcement });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create announcement",
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
        { success: false, error: "Missing announcement ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Received PUT body:", body);

    // Validate required fields
    if (!body.title || !body.content || !body.startDate || !body.endDate || !body.category || !body.priority) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["general", "academic", "event", "news"];
    if (!validCategories.includes(body.category.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    // Validate priority
    const validPriorities = ["low", "normal", "high", "urgent"];
    if (!validPriorities.includes(body.priority.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Invalid priority" },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (endDate < startDate) {
      return NextResponse.json(
        { success: false, error: "End date must be after start date" },
        { status: 400 }
      );
    }

    const existingAnnouncement = await Announcement.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    // Normalize the data
    const normalizedData = {
      ...body,
      category: body.category.toLowerCase(),
      priority: body.priority.toLowerCase(),
    };

    console.log("Updating announcement with data:", normalizedData);
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      normalizedData,
      { new: true }
    );
    console.log("Updated announcement:", updatedAnnouncement);

    return NextResponse.json({ success: true, data: updatedAnnouncement });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update announcement",
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
        { success: false, error: "Missing announcement ID" },
        { status: 400 }
      );
    }

    const announcement = await Announcement.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!announcement) {
      return NextResponse.json(
        { success: false, error: "Announcement not found" },
        { status: 404 }
      );
    }

    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete announcement",
      },
      { status: 500 }
    );
  }
} 