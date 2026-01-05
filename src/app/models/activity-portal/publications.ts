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

const publicationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        "International Journal",
        "National Journal",
        "International Conference",
        "National Conference",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [facultySchema],
      required: true,
    },
    journal_name: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: false,
    },
    month: {
      type: String,
      required: false,
    },
    pages: {
      type: String,
      required: false,
    },
    doi: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
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

export default mongoose.models.Publication ||
  mongoose.model("Publication", publicationSchema);
