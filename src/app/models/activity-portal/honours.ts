import mongoose from "mongoose";

const awardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const honourSchema = new mongoose.Schema(
  {
    facultyInvolved: {
      type: [awardSchema],
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Award", "Recognition"],
    },
    person: {
      type: String,
      required: true,
      enum: ["Faculty", "Student"],
    },
    imgUrl: {
      type: String,
      required: false,
    },
    awardName: {
      type: String,
      required: true,
    },
    awardBy: {
      type: String,
      required: true,
    },
    awardFor: {
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

export default mongoose.models.HonoursAwards ||
  mongoose.model("HonoursAwards", honourSchema);
