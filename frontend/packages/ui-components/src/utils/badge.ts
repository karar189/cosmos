import type { BadgeColor } from '../components';

/**
 * Get badge color based on score value (high score = good)
 * @param score - Score value (0-100)
 * @returns BadgeColor based on score range
 * Mapping (normal - high score = good):
 * - Exceptional (green): 85-100
 * - High (yellow): 60-84
 * - Moderate (orange): 45-59
 * - Low (red): 0-44
 * - Invalid/N/A (gray): outside range or NaN
 */
export function getBadgeColorByScore(score: number): BadgeColor {
  if (isNaN(score) || score < 0 || score > 100) {
    return 'gray';
  }
  
  if (score >= 85) return 'green';
  if (score >= 60) return 'yellow';
  if (score >= 45) return 'orange';
  return 'red';
}
