import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      enum: ["Editor", "Member"],
    },
    journalName: {
      type: String,
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

export default mongoose.models.JournalEditorialBoards ||
  mongoose.model("JournalEditorialBoards", journalSchema);
