import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import OrganizedEvent from "@/app/models/activity-portal/organized";

const handler = createPublicHandler({
  Model: OrganizedEvent,

  searchFields: ["facultyInvolved.name", "category", "published"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";

