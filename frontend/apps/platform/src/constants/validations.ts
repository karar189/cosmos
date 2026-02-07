/**
 * Regular expression patterns used across the application
 */

/**
 * Matches positions between digits where commas should be inserted
 * for thousands formatting (e.g., 1000000 → 1,000,000)
 */
export const THOUSANDS_DELIMITER_PATTERN = /\B(?=(\d{3})+(?!\d))/g;

/**
 * Matches http:// or https:// protocol prefix in URLs
 */
export const URL_PROTOCOL_PATTERN = /^https?:\/\//;

