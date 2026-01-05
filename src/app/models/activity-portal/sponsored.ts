import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const sponsoredSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [facultySchema],
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    fundingAgency: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Ongoing", "Completed"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
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

export default mongoose.models.SponsoredProjects ||
  mongoose.model("SponsoredProjects", sponsoredSchema);
