/**
 * Formatting utilities for dates, numbers, and other data types
 * Shared across all CORE3 applications
 */

/**
 * Formats a month abbreviation to a full date string
 * 
 * @param month - Month abbreviation (e.g., 'Jan', 'Feb', 'Mar')
 * @returns Formatted date string in the format "Month 15, YYYY" (e.g., "Jan 15, 2024")
 * 
 * @example
 * formatMonthToDate('Jan') // Returns "Jan 15, 2024"
 * formatMonthToDate('Dec') // Returns "Dec 15, 2024"
 */
export function formatMonthToDate(month: string): string {
  const currentYear = new Date().getFullYear();
  return `${month} 15, ${currentYear}`;
}

