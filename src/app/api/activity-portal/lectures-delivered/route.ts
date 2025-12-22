import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import LecturesDelivered from "@/app/models/activity-portal/lectures";

const handler = createActivityHandler({
  Model: LecturesDelivered,
  searchFields: ["title", "facultyInvolved.name", "published"],
  defaultSort: { year: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
