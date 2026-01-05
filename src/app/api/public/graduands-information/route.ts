import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import GraduandsInformation from "@/app/models/website/graduands-information";

const handler = createPublicHandler({
  Model: GraduandsInformation,
  searchFields: ["batch", "category"],
  defaultSort: { batch: -1, category: -1 },
});

export const GET = handler.GET;
export const dynamic = "force-dynamic";
