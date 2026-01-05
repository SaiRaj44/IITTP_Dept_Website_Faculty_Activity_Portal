import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/app/lib/mongodb";
import { Document, Model } from "mongoose";

interface GenericActivityHandlerConfig {
  Model: Model<Document>;
  searchFields?: string[];
  populateFields?: { path: string; select?: string }[];
  defaultSort?: Record<string, 1 | -1>;
}

export function createActivityHandler({
  Model,
  searchFields = ["title"],
  populateFields = [],
  defaultSort,
}: GenericActivityHandlerConfig) {
  return {
    async GET(req: NextRequest) {
      try {
        await connectDB();
        const session = await getServerSession();

        if (!session?.user?.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const dbQuery: { [key: string]: unknown } = {
          createdBy: session.user.email,
        };

        // Handle search
        if (query) {
          dbQuery.$or = searchFields.map((field) => ({
            [field]: { $regex: query, $options: "i" },
          }));
        }

        // Process additional filter parameters
        for (const field of searchFields) {
          const value = searchParams.get(field);
          if (value) {
            // Add filter condition, using regex for case-insensitive partial matching
            dbQuery[field] = { $regex: value, $options: "i" };
          }
        }

        const total = await Model.countDocuments(dbQuery);
        const items = await Model.find(dbQuery)
          .populate(populateFields)
          .sort(defaultSort || { createdAt: -1 })
          .skip((page - 1) * limit)
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
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          },
          { status: 500 }
        );
      }
    },

    async POST(req: NextRequest) {
      try {
        await connectDB();
        const session = await getServerSession();

        if (!session?.user?.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const item = await Model.create({
          ...body,
          createdBy: session.user.email,
        });

        return NextResponse.json({ success: true, data: item });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          },
          { status: 400 }
        );
      }
    },

    async PUT(req: NextRequest) {
      try {
        await connectDB();
        const session = await getServerSession();

        if (!session?.user?.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const body = await req.json();

        const existingItem = await Model.findById(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!existingItem || (existingItem as any).createdBy !== session.user.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const item = await Model.findByIdAndUpdate(
          id,
          { ...body },
          { new: true }
        ).populate(populateFields);

        return NextResponse.json({ success: true, data: item });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          },
          { status: 400 }
        );
      }
    },

    async DELETE(req: NextRequest) {
      try {
        await connectDB();
        const session = await getServerSession();

        if (!session?.user?.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const existingItem = await Model.findById(id);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!existingItem || (existingItem as any).createdBy !== session.user.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await Model.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "An unexpected error occurred",
          },
          { status: 400 }
        );
      }
    },
  };
}
