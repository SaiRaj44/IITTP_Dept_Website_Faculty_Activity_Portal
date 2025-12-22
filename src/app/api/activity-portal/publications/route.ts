import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Publication from "@/app/models/activity-portal/publications";

const handler = createActivityHandler({
  Model: Publication,
  searchFields: ["facultyInvolved.name", "category", "published"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
