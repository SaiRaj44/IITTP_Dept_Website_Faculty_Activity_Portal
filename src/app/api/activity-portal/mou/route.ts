import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import MoU from "@/app/models/activity-portal/mou";

const handler = createActivityHandler({
  Model: MoU,
  searchFields: ["details", "date"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
