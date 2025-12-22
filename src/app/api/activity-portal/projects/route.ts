import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Project from "@/app/models/activity-portal/projects";

const handler = createActivityHandler({
  Model: Project,
  searchFields: ["title", "industry"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
