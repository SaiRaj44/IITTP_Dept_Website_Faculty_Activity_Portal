import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Announcement from "@/app/models/website/announcements";

const handler = createPublicHandler({
  Model: Announcement,
  searchFields: ["title", "content", "category"],
  filterFields: ["category", "isActive"],
  defaultFilter: { isActive: true },
});

export const GET = handler.GET; 