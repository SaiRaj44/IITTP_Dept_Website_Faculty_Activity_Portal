import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const mouSchema = new mongoose.Schema(
  {
    details: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [authorSchema],
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

export default mongoose.models.MoU || mongoose.model("MoU", mouSchema);
