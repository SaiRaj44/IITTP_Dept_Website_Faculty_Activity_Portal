import mongoose from "mongoose";

const studentInformationSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: true,
      enum: ["I", "II", "III", "IV"],
    },
    category: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "Ph.D"],
    },
    rollNumber: {
      type: String,
      required: true,
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
studentInformationSchema.index({ year: 1, category: 1 });
studentInformationSchema.index({ rollNumber: 1 });
studentInformationSchema.index({ name: 1 });

export default mongoose.models.StudentInformation ||
  mongoose.model("StudentInformation", studentInformationSchema);
