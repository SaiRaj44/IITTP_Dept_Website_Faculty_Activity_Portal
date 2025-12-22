import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import News from "@/app/models/website/news";

const handler = createActivityHandler({
  Model: News,
  searchFields: ["title", "content"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
