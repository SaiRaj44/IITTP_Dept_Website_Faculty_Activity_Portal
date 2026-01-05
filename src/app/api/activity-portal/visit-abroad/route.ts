import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import VisitAbroad from "@/app/models/activity-portal/abroad";

const handler = createActivityHandler({
  Model: VisitAbroad,
  searchFields: ["countryVisited", "fundingFrom"],
  // populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
