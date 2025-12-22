import mongoose, { Schema } from "mongoose";

// Define schema for program statistics (B.Tech and M.Tech)
const programStatisticsSchema = new Schema({
  registeredCount: {
    type: Number,
    required: [true, "Registered count is required"],
    min: [0, "Registered count must be a positive number"],
  },
  placedCount: {
    type: Number,
    required: [true, "Placed count is required"],
    min: [0, "Placed count must be a positive number"],
  },
  totalOffers: {
    type: Number,
    required: [true, "Total offers is required"],
    min: [0, "Total offers must be a positive number"],
  },
  highestPackage: {
    type: Number,
    required: [true, "Highest package is required"],
    min: [0, "Highest package must be a positive number"],
  },
  lowestPackage: {
    type: Number,
    required: [true, "Lowest package is required"],
    min: [0, "Lowest package must be a positive number"],
  },
  averagePackage: {
    type: Number,
    required: [true, "Average package is required"],
    min: [0, "Average package must be a positive number"],
  },
  medianPackage: {
    type: Number,
    required: [true, "Median package is required"],
    min: [0, "Median package must be a positive number"],
  },
});

// Main PlacementStatistics schema
const placementStatisticsSchema = new Schema(
  {
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
      trim: true,
    },
    batch: {
      type: String,
      required: [true, "Batch is required"],
      trim: true,
    },
    btech: programStatisticsSchema,
    mtech: programStatisticsSchema,
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound index to ensure uniqueness of academicYear and batch
placementStatisticsSchema.index({ academicYear: 1, batch: 1 }, { unique: true });

export default mongoose.models.PlacementStatistics ||
  mongoose.model("PlacementStatistics", placementStatisticsSchema); 