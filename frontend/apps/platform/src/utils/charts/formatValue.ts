/**
 * Formats a numeric value for display in charts
 * 
 * @param value - The numeric value to format
 * @param format - Format type: 'tvl' (for TVL) or 'addresses' (for Active Addresses)
 * @returns Formatted string (e.g., "1.2B", "980M", "920K")
 * 
 * @example
 * formatValue(1200, 'tvl') // Returns "1.20B"
 * formatValue(980, 'tvl') // Returns "980M"
 * formatValue(920, 'addresses') // Returns "920K"
 * formatValue(1200, 'addresses') // Returns "1.20M"
 */
export function formatValue(value: number, format: 'tvl' | 'addresses'): string {
  if (format === 'tvl') {
    if (value >= 1000) return `${(value / 1000).toFixed(2)}B`;
    return `${value}M`;
  } else {
    // addresses format
    if (value >= 1000) return `${(value / 1000).toFixed(2)}M`;
    return `${value}K`;
  }
}

