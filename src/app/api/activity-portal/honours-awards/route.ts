import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import HonoursAwards from "@/app/models/activity-portal/honours";

const handler = createActivityHandler({
  Model: HonoursAwards,
  searchFields: ["awardBy", "awardName"],
  populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
