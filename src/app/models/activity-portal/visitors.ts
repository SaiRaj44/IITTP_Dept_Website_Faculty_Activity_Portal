import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    visitorDetails: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Visitors ||
  mongoose.model("Visitors", visitorSchema);
