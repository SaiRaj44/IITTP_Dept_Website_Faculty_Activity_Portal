import mongoose from "mongoose";

const inventorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const patentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    facultyInvolved: {
      type: [inventorSchema],
      required: true,
    },
    patentNumber: { type: String },
    applicationNumber: { type: String },
    filingDate: { type: Date },
    grantDate: { type: Date },
    status: {
      type: String,
      enum: ["Filed", "Granted", "Published"],
      required: true,
    },
    description: { type: String },
    organization: { type: String },
    country: { type: String },
    date: { type: Date },
    published: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Patent || mongoose.model("Patent", patentSchema);
