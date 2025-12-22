import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
}, { timestamps: true });

export default mongoose.models.Location || mongoose.model('Location', LocationSchema);
