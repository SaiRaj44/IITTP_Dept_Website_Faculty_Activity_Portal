import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import Equipment from "@/app/models/activity-portal/equipments";

const handler = createActivityHandler({
  Model: Equipment,
  searchFields: ["value", "equipmentName"],
  // populateFields: [{ path: "facultyInvolved" }],
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
