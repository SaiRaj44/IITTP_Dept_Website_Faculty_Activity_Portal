import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Newsletter from "@/app/models/website/newsletter";

const handler = createActivityHandler({
  Model: Newsletter,
  searchFields: ["title", "content"],
  populateFields: [{ path: "newsItems" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;