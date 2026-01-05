import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Visitors from "@/app/models/activity-portal/visitors";

const handler = createPublicHandler({
  Model: Visitors,

  searchFields: ["visitorDetails", "purpose"],
  // populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
