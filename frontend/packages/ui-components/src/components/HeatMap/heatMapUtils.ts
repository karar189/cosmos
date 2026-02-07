
import { colors } from '../../theme/styleSystem';

/**
 * Returns the background color for a given heat map level.
 *
 * @param {number} level - The intensity level (0-4).
 * @returns {string} The corresponding background color in rgba hex string.
 */
export const getBackgroundColor = (level: number): string => {
  const baseColor = colors.heatMap.base;
  switch (level) {
    case 0:
      return `${baseColor}12`;
    case 1:
      return `${baseColor}40`;
    case 2:
      return `${baseColor}80`;
    case 3:
      return `${baseColor}A6`;
    case 4:
      return baseColor;
    default:
      return baseColor;
  }
};

/**
 * Maps a given intensity value to a level index based on intensity thresholds.
 *
 * @param {number} intensity - The intensity value to categorize.
 * @param {number[]} intensityLevels - Array of intensity level thresholds, ordered in ascending value.
 * @returns {number} The index of the matching intensity level.
 */
export const getIntensityLevel = (intensity: number, intensityLevels: number[]): number => {
  if (intensity === 0) return 0;
  for (let i = 1; i < intensityLevels.length; i++) {
    if (intensity <= intensityLevels[i]) {
      return i;
    }
  }
  return Math.min(intensityLevels.length - 1, 4);
};

/**
 * Finds the upper range value (threshold) for a given intensity.
 *
 * @param {number} intensity - The intensity value to map.
 * @param {number[]} intensityLevels - Array of intensity level thresholds.
 * @returns {number} The corresponding intensity threshold from intensityLevels.
 */
export const getIntensityRange = (intensity: number, intensityLevels: number[]): number => {
  if (intensity === 0) return intensityLevels[0] || 0;
  for (let i = 1; i < intensityLevels.length; i++) {
    if (intensity <= intensityLevels[i]) {
      return intensityLevels[i];
    }
  }
  return intensityLevels[intensityLevels.length - 1];
};

