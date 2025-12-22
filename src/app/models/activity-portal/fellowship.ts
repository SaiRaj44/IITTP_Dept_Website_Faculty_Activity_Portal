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

const fellowshipSchema = new mongoose.Schema(
  {
    facultyInvolved: {
      type: [authorSchema],
      required: true,
    },
    fellowshipName: {
      type: String,
      required: true,
    },
    admissionYear: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: String,
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

export default mongoose.models.Fellowships ||
  mongoose.model("Fellowships", fellowshipSchema);
