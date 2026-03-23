import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  disruptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Disruption', required: true },
  status: { type: String, enum: ['DRAFT', 'SCORING', 'APPROVED_AUTO', 'MANUAL_REVIEW', 'REJECTED', 'SETTLED'], default: 'DRAFT' },
  fraudScore: { type: Number, default: 100 },
  lossDurationMins: { type: Number, required: true },
  payoutAmount: { type: Number, required: true },
  reason: { type: String }
}, { timestamps: true });

export const Claim = mongoose.model('Claim', claimSchema);
