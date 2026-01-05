import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/mongodb";
import { Document, Model } from "mongoose";

interface GenericPublicHandlerConfig {
  Model: Model<Document>;
  searchFields?: string[];
  filterFields?: string[];
  populateFields?: { path: string; select?: string }[];
  defaultSort?: { [key: string]: 1 | -1 };
  defaultFilter?: Record<string, unknown>;
}

// Define interfaces for the query structure
interface DateQuery {
  $gte?: Date;
  $lte?: Date;
  [key: string]: Date | undefined;
}

// Define a more specific type for MongoDB query operators
interface MongoRegexQuery {
  $regex: string;
  $options: string;
}

// Either remove the unused interface or use it
// Option 1: Remove it completely since it's not being used
// interface DbQuery {
//   date?: DateQuery;
//   [key: string]: any;
// }

// Option 2: Use it in your code (preferred solution)
type DbQuery = {
  date?: DateQuery;
  $or?: Array<Record<string, MongoRegexQuery>>;
  [key: string]: unknown; // Use unknown instead of any
};

export function createPublicHandler({
  Model,
  searchFields = ["title"],
  filterFields = [],
  populateFields = [],
  defaultSort = { createdAt: -1 },
  defaultFilter = {},
}: GenericPublicHandlerConfig) {
  return {
    async GET(req: NextRequest) {
      try {
        await connectDB();
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        // Search
        const query = searchParams.get("query");
        // Use the DbQuery type instead of any
        const dbQuery: DbQuery = { ...defaultFilter };

        if (query) {
          dbQuery.$or = searchFields.map((field) => ({
            [field]: { $regex: query, $options: "i" },
          }));
        }

        // Filters
        filterFields.forEach((field) => {
          const value = searchParams.get(field);
          if (value) {
            dbQuery[field] = value;
          }
        });

        // Date range filter
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        if (startDate || endDate) {
          dbQuery.date = {} as DateQuery;
          if (startDate) dbQuery.date.$gte = new Date(startDate);
          if (endDate) dbQuery.date.$lte = new Date(endDate);
        }

        // Execute query
        const total = await Model.countDocuments(dbQuery);
        const items = await Model.find(dbQuery)
          .populate(populateFields)
          .sort(defaultSort)
          .skip((page - 1) * limit)
          .limit(limit);

        // Get unique filter values
        const filterValues: { [key: string]: string[] } = {};
        for (const field of filterFields) {
          filterValues[field] = await Model.distinct(field, {
            published: true,
          });
        }

        return NextResponse.json({
          success: true,
          data: items,
          filters: filterValues,
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

    async GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
      try {
        await connectDB();
        const item = await Model.findOne({
          _id: params.id,
          published: true,
        }).populate(populateFields);

        if (!item) {
          return NextResponse.json(
            { success: false, error: "Item not found" },
            { status: 404 }
          );
        }

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
          { status: 500 }
        );
      }
    },
  };
}
