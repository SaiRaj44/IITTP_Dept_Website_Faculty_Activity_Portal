import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Fellowships from "@/app/models/activity-portal/fellowship";

const handler = createActivityHandler({
  Model: Fellowships,
  searchFields: ["fellowshipName", "admissionYear"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
