import mongoose from "mongoose";
const attendedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});
const attendSchema = new mongoose.Schema(
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
        "Training",
      ],
    },
    facultyInvolved: {
      type: [attendedSchema],
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
    studentsAttended: {
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
    fundingFrom: {
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

export default mongoose.models.AttendEvent ||
  mongoose.model("AttendEvent", attendSchema);
