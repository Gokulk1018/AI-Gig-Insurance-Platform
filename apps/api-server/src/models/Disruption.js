import mongoose from 'mongoose';

const disruptionSchema = new mongoose.Schema({
  zoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
  type: { type: String, enum: ['HEAVY_RAIN', 'EXTREME_HEAT', 'POLLUTION_SEVERE', 'WATERLOGGING'], required: true },
  status: { type: String, enum: ['ACTIVE', 'RESOLVED'], default: 'ACTIVE' },
  severityIndex: { type: Number, default: 1 },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
}, { timestamps: true });

export const Disruption = mongoose.model('Disruption', disruptionSchema);
