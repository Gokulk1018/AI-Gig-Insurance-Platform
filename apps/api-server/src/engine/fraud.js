export const calculateFraudScore = (user, disruption, claimDuration) => {
  let score = user.trustScore || 100;
  let reason = '';

  // Rule 1: High frequency velocity
  if (user.subscription.amountUsed > (user.subscription.weeklyCap * 0.8)) {
    score -= 30;
    reason += 'High policy usage velocity. ';
  }

  // Rule 2: Unrealistic loss duration
  if (claimDuration > 120) {
    score -= 20;
    reason += 'Claim duration suspiciously long. ';
  }

  // Determine Action
  let action = 'APPROVED_AUTO';
  if (score < 80) action = 'MANUAL_REVIEW';
  if (score < 40) action = 'REJECTED';

  return { finalScore: score, action, reason: reason || 'Trust baseline maintained.' };
};
