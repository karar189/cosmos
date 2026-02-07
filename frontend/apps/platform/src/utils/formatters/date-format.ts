export const daysDifference = (date: Date): number => {
    const timeDifference = Math.abs(new Date().getTime() - date.getTime());
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
}
export type DateFormatOptions = {
  year: 'numeric' | '2-digit';
  month: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day: 'numeric' | '2-digit';
}
export const CommonDateFormats: Record<string, DateFormatOptions> = {
  /** Jan 10 2025 */
  SHORT_MONTH_DAY_YEAR: {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
  /** January 10 2025 */
  LONG_MONTH_DAY_YEAR : {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
}
export const formatDate = (date: Date, options: DateFormatOptions = CommonDateFormats.SHORT_MONTH_DAY_YEAR): string => {
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  return formattedDate;
}