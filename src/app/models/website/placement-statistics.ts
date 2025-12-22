import mongoose from "mongoose";

const placementStatisticsSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech"],
    },
    academicYear: {
      type: String,
      required: true,
    },
    registeredCount: {
      type: Number,
      required: true,
    },
    totalOffers: {
      type: Number,
      required: true,
    },
    highestSalary: {
      type: Number,
      required: true,
    },
    averageSalary: {
      type: Number,
      required: true,
    },
    lowestSalary: {
      type: Number,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for efficient querying
placementStatisticsSchema.index({ academicYear: 1, batch: 1 });

export default mongoose.models.PlacementStatistics ||
  mongoose.model("PlacementStatistics", placementStatisticsSchema);
