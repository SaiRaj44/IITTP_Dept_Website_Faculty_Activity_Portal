import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Patent from "@/app/models/activity-portal/patent";

const handler = createActivityHandler({
  Model: Patent,
  searchFields: ["title", "patentNumber"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
