import type { BadgeColor } from '@core3/ui-components';

/**
 * Get badge color based on score (for PoL - Probability of Loss)
 * @param score - Score value (0-100)
 * @returns BadgeColor based on score range
 * Mapping (inverted - high score = bad):
 * - Very High (red): 85-100
 * - High (yellow): 60-84
 * - Moderate (orange): 45-59
 * - Low (green): 0-44
 */
export function getBadgeColorByScore(score: number): BadgeColor {
  if (score >= 85 && score <= 100) {
    return 'red';
  }
  if (score >= 60 && score <= 84) {
    return 'yellow';
  }
  if (score >= 45 && score <= 59) {
    return 'orange';
  }
  if (score >= 0 && score <= 44) {
    return 'green';
  }
  // Default to gray for scores outside expected range
  return 'gray';
}

/**
 * Get badge color based on Security Score
 * @param score - Security score value (0-100)
 * @returns BadgeColor based on score range
 * Mapping (normal - high score = good):
 * - Exceptional (green): 85-100
 * - High (yellow): 60-84
 * - Moderate (orange): 45-59
 * - Low (red): 0-44
 */
export function getBadgeColorBySecurityScore(score: number): BadgeColor {
  if (score >= 85 && score <= 100) {
    return 'green';
  }
  if (score >= 60 && score <= 84) {
    return 'yellow';
  }
  if (score >= 45 && score <= 59) {
    return 'orange';
  }
  if (score >= 0 && score <= 44) {
    return 'red';
  }
  // Default to gray for scores outside expected range
  return 'gray';
}

/**
 * Get badge color based on PoL (Probability of Loss) score
 * @param polScore - PoL score value (0-100)
 * @returns BadgeColor based on PoL score range
 * Mapping (inverted from regular scores - high PoL is bad):
 * - Low PoL (green): 0-10
 * - Moderate (yellow): 11-40
 * - High (orange): 41-79
 * - Very High (red): 80-100
 */
export function getBadgeColorByPolScore(polScore: number): BadgeColor {
  if (polScore >= 80 && polScore <= 100) {
    return 'red';
  }
  if (polScore >= 41 && polScore <= 79) {
    return 'orange';
  }
  if (polScore >= 11 && polScore <= 40) {
    return 'yellow';
  }
  if (polScore >= 0 && polScore <= 10) {
    return 'green';
  }
  // Default to gray for scores outside expected range
  return 'gray';
}

/**
 * Get badge color based on rating level
 * @param level - Rating level (e.g., AAA, AA, A, BBB, BB, B, CCC, CC, C, DDD, DD, D)
 * @returns BadgeColor based on rating level
 * Mapping based on Confidence levels:
 * - Exceptional (green): AAA, AA, A
 * - High (yellow): BBB, BB, B
 * - Moderate (orange): CCC, CC
 * - Low (red): C, DDD, DD, D
 */
export function getBadgeColorByLevel(level: string): BadgeColor {
  const upperLevel = level.toUpperCase();

  // Exceptional: AAA, AA, A
  if (upperLevel === 'AAA' || upperLevel === 'AA' || upperLevel === 'A' || upperLevel.includes('A+')) {
    return 'green';
  }

  // High: BBB, BB, B
  if (upperLevel === 'BBB' || upperLevel === 'BB' || upperLevel === 'B') {
    return 'yellow';
  }

  // Moderate: CCC, CC
  if (upperLevel === 'CCC' || upperLevel === 'CC') {
    return 'orange';
  }

  // Low: C, DDD, DD, D
  if (upperLevel === 'C' || upperLevel === 'DDD' || upperLevel === 'DD' || upperLevel === 'D') {
    return 'red';
  }

  return 'gray';
}

export const getColorBySeverity = (severity?: string) => {
  if (!severity) {
    return 'gray';
  }
  switch (severity) {
    case 'low':
      return 'green';
    case 'medium':
      return 'yellow';
    case 'high':
      return 'red';
    default:
      return 'gray';
  }
};
