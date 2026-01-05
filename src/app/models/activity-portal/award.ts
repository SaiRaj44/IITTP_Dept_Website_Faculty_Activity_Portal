import mongoose from "mongoose";

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Academic', 'Research', 'Teaching', 'Service', 'Other'],
    required: true 
  },
  awardingBody: { type: String, required: true },
  date: { type: Date, required: true },
  year: { type: String, required: true },
  citation: { type: String },
  prize: { type: String },
  published: { type: Boolean, default: false },
  createdBy: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Award || mongoose.model("Award", awardSchema); 