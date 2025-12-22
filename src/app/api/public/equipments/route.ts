import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Equipment from "@/app/models/activity-portal/equipments";

const handler = createPublicHandler({
  Model: Equipment,
  searchFields: ["equipmentName", "value"],
  // populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
