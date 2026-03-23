import mongoose from 'mongoose';

const shiftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  dayOfWeek: { type: Number, required: true }, // 0-6 (Sun-Sat)
  startHour: { type: Number, required: true }, // 0-23
  endHour: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Shift = mongoose.model('Shift', shiftSchema);
