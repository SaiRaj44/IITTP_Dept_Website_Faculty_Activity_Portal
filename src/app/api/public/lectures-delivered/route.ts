import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import LecturesDelivered from "@/app/models/activity-portal/lectures";

const handler = createPublicHandler({
  Model: LecturesDelivered,
  searchFields: ["title", "facultyInvolved.name", "institution"],
  filterFields: ["year"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { year: -1 },
  defaultFilter: { published: true },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
