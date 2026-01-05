import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import OrganizedEvent from "@/app/models/activity-portal/organized";

const handler = createActivityHandler({
  Model: OrganizedEvent,

  searchFields: ["facultyInvolved.name", "category", "published"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
