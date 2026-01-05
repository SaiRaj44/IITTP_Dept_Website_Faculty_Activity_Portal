import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import VisitAbroad from "@/app/models/activity-portal/abroad";

const handler = createPublicHandler({
  Model: VisitAbroad,

  searchFields: ["countryVisited", "fundingFrom"],
  // populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
