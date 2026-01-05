import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import AttendEvent from "@/app/models/activity-portal/attended";

const handler = createActivityHandler({
  Model: AttendEvent,

  searchFields: ["facultyInvolved.name", "category", "published"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
