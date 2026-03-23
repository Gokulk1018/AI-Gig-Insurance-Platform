import { Shift } from '../models/Shift.js';
import { Claim } from '../models/Claim.js';
import { User } from '../models/User.js';
import { calculateFraudScore } from './fraud.js';

export const handleDisruption = async (disruption, ioClient) => {
  console.log(`⚡ TRIGGER ENGINE: Analyzing disruption ${disruption._id} in Zone ${disruption.zoneId}`);

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();

  // Find users currently on shift in this zone
  const activeShifts = await Shift.find({
    zoneId: disruption.zoneId,
    dayOfWeek: currentDay,
    startHour: { $lte: currentHour },
    endHour: { $gte: currentHour },
    isActive: true
  }).populate('userId');

  console.log(`🎯 Found ${activeShifts.length} active shifts in the affected zone.`);

  const newClaims = [];

  for (const shift of activeShifts) {
    const user = shift.userId;
    // Check if subscription has cap left
    const hasCapacity = (user.subscription.weeklyCap - user.subscription.amountUsed) > 0;

    if (user.subscription.status === 'ACTIVE' && hasCapacity) {
      
      const durationMins = 60; // Mock: 1 hr block
      const payoutAmount = user.avgHourlyEarnings || 50;
      const fraudResult = calculateFraudScore(user, disruption, durationMins);

      // Create a draft claim
      const claim = await Claim.create({
        userId: user._id,
        disruptionId: disruption._id,
        status: fraudResult.action,
        fraudScore: fraudResult.finalScore,
        lossDurationMins: durationMins,
        payoutAmount: payoutAmount,
        reason: fraudResult.reason
      });
      newClaims.push(claim);

      console.log(`📝 Generated ${fraudResult.action} Claim ${claim._id} for User ${user.phone}`);

      // Emit realtime alert to Rider
      if (ioClient) {
        ioClient.to(disruption.zoneId.toString()).emit('zone_alert', {
          type: disruption.type,
          message: `Protection Active! ${disruption.type.replace('_', ' ')} detected in your zone. ShiftShield is guarding your income.`,
          claimId: claim._id
        });
      }
    }
  }
  
  return newClaims;
};
