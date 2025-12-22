import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Software from "@/app/models/activity-portal/softwares";

const handler = createPublicHandler({
  Model: Software,
  searchFields: ["details", "facultyInvolved.name", "date"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
