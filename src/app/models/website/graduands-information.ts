import mongoose from "mongoose";

const graduandsInformationSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "Ph.D", "M.S.(R)"],
    },
    rollNumber: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    name: {
      type: String,
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

// Add indexes for efficient querying
graduandsInformationSchema.index({ batch: 1, category: 1 });
graduandsInformationSchema.index({ rollNumber: 1 });
graduandsInformationSchema.index({ name: 1 });

export default mongoose.models.GraduandsInformation ||
  mongoose.model("GraduandsInformation", graduandsInformationSchema);
