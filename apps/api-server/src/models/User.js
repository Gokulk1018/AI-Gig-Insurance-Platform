import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['RIDER', 'ADMIN'], default: 'RIDER' },
  trustScore: { type: Number, default: 100 },
  avgHourlyEarnings: { type: Number, default: 0 },
  primaryZoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
  upiId: { type: String },
  subscription: {
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'INACTIVE' },
    planTier: { type: String, enum: ['LITE', 'STANDARD', 'PLUS', 'NONE'], default: 'NONE' },
    weeklyCap: { type: Number, default: 0 },
    amountUsed: { type: Number, default: 0 },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
