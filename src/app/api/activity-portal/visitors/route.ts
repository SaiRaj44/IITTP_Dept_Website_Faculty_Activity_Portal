import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Visitors from "@/app/models/activity-portal/visitors";

const handler = createActivityHandler({
  Model: Visitors,
  searchFields: ["visitorDetails", "purpose"],
  // populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
