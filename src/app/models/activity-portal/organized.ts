import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const eventSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "Short-term Courses",
        "Workshops",
        "Seminars",
        "Symposia",
        "Conferences",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [organizerSchema],
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
    venue: {
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

export default mongoose.models.OrganizedEvent ||
  mongoose.model("OrganizedEvent", eventSchema);
