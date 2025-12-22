import mongoose from "mongoose";

const staffInformationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Technical", "Non Technical"],
    },
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    PhD: {
      type: String,
      required: false,
    },
    areas: {
      type: String,
      required: false,
    },
    office: {
      type: String,
      required: false,
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

export default mongoose.models.StaffInformation ||
  mongoose.model("StaffInformation", staffInformationSchema);
