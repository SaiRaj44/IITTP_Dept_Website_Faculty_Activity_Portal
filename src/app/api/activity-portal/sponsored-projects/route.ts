import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import SponsoredProjects from "@/app/models/activity-portal/sponsored";

const handler = createActivityHandler({
  Model: SponsoredProjects,
  searchFields: ["title", "fundingAgency"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
