import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import Alumni from "@/app/models/website/graduands-information";

const handler = createPublicHandler({
  Model: Alumni,

  searchFields: ["category", "rollNumber"],

  defaultSort: { date: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
