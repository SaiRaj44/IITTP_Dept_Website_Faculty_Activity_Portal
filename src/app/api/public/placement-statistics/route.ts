import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import PlacementStatistics from "@/app/models/website/placement-statistics";

const handler = createPublicHandler({
  Model: PlacementStatistics,
  searchFields: ["academicYear", "batch", "category"],
  defaultSort: { academicYear: -1, category: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
