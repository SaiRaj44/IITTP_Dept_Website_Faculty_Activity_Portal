import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import SliderImage from "@/app/models/website/slider-images";

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
      const sliderImage = await SliderImage.findOne({
        _id: id,
        createdBy: session.user.email,
      });

      if (!sliderImage) {
        return NextResponse.json(
          { success: false, error: "Slider image not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: sliderImage });
    }

    const sliderImages = await SliderImage.find({
      createdBy: session.user.email,
    }).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: sliderImages });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch slider images",
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
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the slider image
    const sliderImage = await SliderImage.create({
      ...body,
      createdBy: session.user.email,
    });

    console.log("Created slider image:", sliderImage);
    return NextResponse.json({ success: true, data: sliderImage });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create slider image",
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
        { success: false, error: "Missing slider image ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("Received PUT body:", body);

    // Validate required fields
    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingSliderImage = await SliderImage.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!existingSliderImage) {
      return NextResponse.json(
        { success: false, error: "Slider image not found" },
        { status: 404 }
      );
    }

    const updatedSliderImage = await SliderImage.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    console.log("Updated slider image:", updatedSliderImage);
    return NextResponse.json({ success: true, data: updatedSliderImage });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update slider image",
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
        { success: false, error: "Missing slider image ID" },
        { status: 400 }
      );
    }

    const sliderImage = await SliderImage.findOne({
      _id: id,
      createdBy: session.user.email,
    });

    if (!sliderImage) {
      return NextResponse.json(
        { success: false, error: "Slider image not found" },
        { status: 404 }
      );
    }

    await SliderImage.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete slider image",
      },
      { status: 500 }
    );
  }
} 