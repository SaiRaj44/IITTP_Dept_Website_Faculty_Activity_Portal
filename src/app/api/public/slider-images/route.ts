import { createPublicHandler } from "@/app/lib/api/genericPublicHandler";
import SliderImage from "@/app/models/website/slider-images";

const handler = createPublicHandler({
  Model: SliderImage,
  searchFields: ["title", "description"],
  filterFields: ["isActive"],
  defaultFilter: { isActive: true },
  defaultSort: { order: -1 },
});

export const GET = handler.GET;
