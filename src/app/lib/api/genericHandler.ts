import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

type MongoError = Error & { code?: number };

export type HandlerConfig = {
  Model: mongoose.Model<unknown>;
  searchFields?: string[];
  filterFields?: string[];
  populateFields?: string[];
  defaultSort?: Record<string, 1 | -1>;
};

type DbQuery = Record<string, unknown>;

export const createHandler = (config: HandlerConfig) => {
  const {
    Model,
    searchFields = [],
    filterFields = [],
    populateFields = [],
    defaultSort = { createdAt: -1 },
  } = config;

  const buildQuery = (searchParams: URLSearchParams) => {
    const dbQuery: DbQuery = {};

    // Handle search
    const searchTerm = searchParams.get("search");
    if (searchTerm && searchFields.length > 0) {
      dbQuery.$or = searchFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      }));
    }

    // Handle filters
    filterFields.forEach((field) => {
      const filterValue = searchParams.get(field);
      if (filterValue) {
        dbQuery[field] = filterValue;
      }
    });

    return dbQuery;
  };

  const handleMongoError = (error: unknown) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      const mongoError = error as MongoError;

      if (mongoError.code === 11000) {
        errorMessage = "Item with this information already exists";
        statusCode = 409;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  };

  return {
    async get(request: NextRequest) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const query = buildQuery(searchParams);

        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const total = await Model.countDocuments(query);

        let dataQuery = Model.find(query)
          .sort(defaultSort)
          .skip(skip)
          .limit(limit);

        if (populateFields.length > 0) {
          populateFields.forEach((field) => {
            dataQuery = dataQuery.populate(field);
          });
        }

        const data = await dataQuery;

        return NextResponse.json({
          data,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        });
      } catch (error: unknown) {
        console.error("API Error:", error);
        return handleMongoError(error);
      }
    },

    async post(request: NextRequest) {
      try {
        const body = await request.json();
        const newItem = new Model(body);
        await newItem.save();
        return NextResponse.json(newItem);
      } catch (error: unknown) {
        console.error("API Error:", error);
        return handleMongoError(error);
      }
    },

    async put(request: NextRequest) {
      try {
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
          );
        }

        const updatedItem = await Model.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!updatedItem) {
          return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }

        return NextResponse.json(updatedItem);
      } catch (error: unknown) {
        console.error("API Error:", error);
        return handleMongoError(error);
      }
    },

    async delete(request: NextRequest) {
      try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
          return NextResponse.json(
            { error: "ID is required" },
            { status: 400 }
          );
        }

        const deletedItem = await Model.findByIdAndDelete(id);

        if (!deletedItem) {
          return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: "Item deleted successfully" });
      } catch (error: unknown) {
        console.error("API Error:", error);
        return handleMongoError(error);
      }
    },
  };
};
