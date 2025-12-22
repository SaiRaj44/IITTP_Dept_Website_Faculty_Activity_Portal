import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import JournalEditorialBoards from "@/app/models/activity-portal/journalboard";

const handler = createPublicHandler({
  Model: JournalEditorialBoards,
  searchFields: ["journalName", "position"],
  filterFields: ["journalName", "position"],
  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
