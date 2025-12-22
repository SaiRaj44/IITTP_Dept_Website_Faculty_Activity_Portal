import mongoose from "mongoose";

const facultyInformationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Regular", "Adjunct", "Guest"],
    },
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
      enum: ["Assistant Professor", "Associate Professor", "Professor"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
      required: true,
    },
    office: {
      type: String,
      required: true,
    },
    webpage: {
      type: String,
    },
    researchInterests: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
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

export default mongoose.models.FacultyInformation ||
  mongoose.model("FacultyInformation", facultyInformationSchema);
