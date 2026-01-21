import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    newsItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'News',
      required: false,
    }],
    publicationDate: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      default: false,
    },
    subscribers: [{
      email: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: false,
      },
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);