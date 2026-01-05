import mongoose from "mongoose";
const lecturedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});
const specialSchema = new mongoose.Schema(
  {
    facultyInvolved: {
      type: [lecturedSchema],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    year: {
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

export default mongoose.models.LecturesDelivered ||
  mongoose.model("LecturesDelivered", specialSchema);
