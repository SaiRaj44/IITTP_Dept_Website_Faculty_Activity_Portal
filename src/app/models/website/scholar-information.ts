import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const scholarInformationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["PhD Regular", "PhD External", "MS Regular"],
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [facultySchema],
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

export default mongoose.models.ScholarInformation ||
  mongoose.model("ScholarInformation", scholarInformationSchema);
