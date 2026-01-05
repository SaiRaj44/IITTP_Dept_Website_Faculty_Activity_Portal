import mongoose from "mongoose";

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    current_position: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
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

export default mongoose.models.Alumni || mongoose.model("Alumni", alumniSchema); 