import mongoose from "mongoose";

const facutlySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const projectSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "RBIC Project",
        "Industrial Consultancy",
        "Consultancy Project",
        "Sponsored Project",
      ],
    },
    title: { type: String, required: true },
    facultyInvolved: {
      type: [facutlySchema],
      required: true,
    },
    year: { type: String, required: true },
    industry: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date, required: true },
    published: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Projects ||
  mongoose.model("Projects", projectSchema);
