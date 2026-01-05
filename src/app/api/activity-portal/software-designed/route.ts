import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Software from "@/app/models/activity-portal/softwares";

const handler = createActivityHandler({
  Model: Software,
  searchFields: ["details", "date"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
