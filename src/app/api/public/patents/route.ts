import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Patent from "@/app/models/activity-portal/patent";

const handler = createPublicHandler({
  Model: Patent,
  searchFields: ["title", "patentNumber"],
  filterFields: ["status", "country"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
