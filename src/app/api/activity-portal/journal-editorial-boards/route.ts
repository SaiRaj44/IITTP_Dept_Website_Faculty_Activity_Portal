import { createActivityHandler } from "@/app/lib/api/genericActivityHandler";
import JournalEditorialBoards from "@/app/models/activity-portal/journalboard";

const handler = createActivityHandler({
  Model: JournalEditorialBoards,
  searchFields: ["journalName", "position"],

  defaultSort: { filingDate: -1 },
});

export const GET = handler.GET;
export const POST = handler.POST;
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
