import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import News from "@/app/models/website/news";

const handler = createPublicHandler({
  Model: News,
  searchFields: ["title", "facultyInvolved.name"],
  filterFields: ["category","published"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
