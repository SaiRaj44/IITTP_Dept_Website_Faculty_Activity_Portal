import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import HonoursAwards from "@/app/models/activity-portal/honours";

const handler = createPublicHandler({
  Model: HonoursAwards,
  searchFields: ["awardName", "awardBy", "facultyInvolved.name"],
  filterFields: ["category", "person"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
  defaultFilter: { published: true },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
