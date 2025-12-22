import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model("Slider", sliderSchema); 