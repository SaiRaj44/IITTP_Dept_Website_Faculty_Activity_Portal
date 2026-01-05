import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    equipmentName: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
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

export default mongoose.models.Equipment ||
  mongoose.model("Equipment", equipmentSchema);
