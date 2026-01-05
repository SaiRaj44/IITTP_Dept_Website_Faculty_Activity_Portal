import mongoose from "mongoose";

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  institute: {
    type: String,
    required: false,
  },
});

const bookSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["Monograph", "Book"],
    },
    chapter: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    facultyInvolved: {
      type: [authorSchema],
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    volume: {
      type: String,
      required: false,
    },
    pages: {
      type: String,
      required: false,
    },
    isbn: {
      type: String,
      required: false,
    },
    year: {
      type: String,
      required: false,
    },
    month: {
      type: String,
      required: false,
    },
    imgURL: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
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

export default mongoose.models.Books || mongoose.model("Books", bookSchema);
