import mongoose from 'mongoose';

const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  activeRisks: [{ type: String }],
  location: {
    type: { type: String, enum: ['Polygon'], default: 'Polygon' },
    coordinates: { type: [[[Number]]], required: true }
  }
}, { timestamps: true });

zoneSchema.index({ location: '2dsphere' });

export const Zone = mongoose.model('Zone', zoneSchema);
