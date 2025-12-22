import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import StaffInformation from "@/app/models/website/staff-information";

const handler = createPublicHandler({
  Model: StaffInformation,
  searchFields: ["name", "designation", "category", "email"],
  filterFields: ["category", "published"],
  defaultFilter: { published: true },
  defaultSort: { order: 1 },
});

export const GET = handler.GET; 