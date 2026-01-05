import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import AttendEvent from "@/app/models/activity-portal/attended";

const handler = createPublicHandler({
  Model: AttendEvent,

  searchFields: ["facultyInvolved.name", "category", "published"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";

