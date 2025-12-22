import mongoose from "mongoose";

const abroadSchema = new mongoose.Schema(
  {
    countryVisited: {
      type: String,
      required: true,
    },
    fundingFrom: {
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

export default mongoose.models.VisitAbroad ||
  mongoose.model("VisitAbroad", abroadSchema);
