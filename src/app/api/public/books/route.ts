import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Book from "@/app/models/activity-portal/books";

const handler = createPublicHandler({
  Model: Book,
  searchFields: ["title", "facultyInvolved.name", "publisher"],
  filterFields: ["category", "publisher", "published"],
  populateFields: [{ path: "facultyInvolved" }],
  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
