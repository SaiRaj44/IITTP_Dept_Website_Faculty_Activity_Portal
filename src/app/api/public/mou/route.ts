import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import MoU from "@/app/models/activity-portal/mou";

const handler = createPublicHandler({
  Model: MoU,
  searchFields: ["details", "facultyInvolved.name", "date"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
