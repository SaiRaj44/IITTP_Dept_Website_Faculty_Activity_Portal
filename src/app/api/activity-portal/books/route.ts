import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Book from "@/app/models/activity-portal/books";

const handler = createActivityHandler({
  Model: Book,
  searchFields: ["title", "category", "publisher"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
