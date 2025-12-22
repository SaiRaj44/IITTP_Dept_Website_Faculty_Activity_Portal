import mongoose from "mongoose";

const placementSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
    },
    statistics: {
      total_students: Number,
      placed_students: Number,
      highest_package: Number,
      average_package: Number,
      median_package: Number,
    },
    companies: [{
      name: String,
      students_placed: Number,
      package_offered: Number
    }],
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.models.Placement || mongoose.model("Placement", placementSchema); 