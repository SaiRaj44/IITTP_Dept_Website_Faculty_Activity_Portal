import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Fellowships from "@/app/models/activity-portal/fellowship";

const handler = createPublicHandler({
  Model: Fellowships,
  searchFields: ["fellowshipName", "facultyInvolved.name"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
