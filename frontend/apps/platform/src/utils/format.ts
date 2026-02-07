import BigNumber from 'bignumber.js';

import { THOUSANDS_DELIMITER_PATTERN, URL_PROTOCOL_PATTERN } from '@/constants/validations';

export interface FormatPercentageOptions {
  suffix?: string;
  prefix?: string;
  plusSign?: boolean;
  decimalPlaces?: number;
}

export interface FormatAmountOptions {
  /**
   * Automatically format large numbers with K/M/B suffixes
   * - >= 1,000,000,000 → B (billions)
   * - >= 1,000,000 → M (millions)
   * - >= 1,000 → K (thousands)
   */
  compact?: boolean;
  decimalPlaces?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * Formats a number as a percentage
 * @param value - The number to format (can be a number, string, or BigNumber)
 * @param options - Formatting options
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number | string | BigNumber,
  options: FormatPercentageOptions = {}
): string {
  const { suffix = '%', prefix = '', plusSign = true, decimalPlaces = 1 } = options;

  const bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value);

  // If decimal is 0, return nearest value to left (round down)
  let formatted: string;
  if (decimalPlaces === 0) {
    formatted = bn.integerValue(BigNumber.ROUND_DOWN).toString();
  } else {
    formatted = bn.toFixed(decimalPlaces);
  }

  // Add plus sign for positive values if enabled
  if (plusSign && bn.isPositive() && !bn.isZero()) {
    formatted = `+${formatted}`;
  }

  return `${prefix}${formatted}${suffix}`;
}

/**
 * Formats a number as an amount with optional compact formatting (K/M/B)
 * @param value - The number to format (can be a number, string, or BigNumber)
 * @param options - Formatting options
 * @returns Formatted amount string
 */
export function formatAmount(
  value: number | string | BigNumber,
  options: FormatAmountOptions = {}
): string {
  const { compact = false, decimalPlaces = 2, decimals = 1, prefix = '', suffix = '' } = options;

  let bn = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
  if (decimals > 1) {
    bn = bn.div(BigNumber(10).pow(decimals));
  }
  const absValue = bn.abs();

  let formatted: string;
  let unitSuffix = '';

  if (compact) {
    // Auto-format based on magnitude
    if (absValue.gte(1_000_000_000)) {
      // Billions
      const billions = absValue.dividedBy(1_000_000_000);
      formatted = billions.decimalPlaces(decimalPlaces).toString();
      unitSuffix = 'B';
    } else if (absValue.gte(1_000_000)) {
      // Millions
      const millions = absValue.dividedBy(1_000_000);
      formatted = millions.decimalPlaces(decimalPlaces).toString();
      unitSuffix = 'M';
    } else if (absValue.gte(1_000)) {
      // Thousands
      const thousands = absValue.dividedBy(1_000);
      formatted = thousands.decimalPlaces(decimalPlaces).toString();
      unitSuffix = 'K';
    } else {
      // No suffix needed
      formatted = absValue.decimalPlaces(decimalPlaces).toString();
    }
  } else {
    // Format as regular number with comma delimiters
    formatted = absValue.decimalPlaces(decimalPlaces).toString();
  }

  // Add comma delimiters for thousands (only when not using compact format)
  if (!compact || !unitSuffix) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(THOUSANDS_DELIMITER_PATTERN, ',');
    formatted = parts.join('.');
  }

  // Handle negative sign (sign comes before prefix for currency: -$100, not $-100)
  const sign = bn.isNegative() ? '-' : '';

  // Build final suffix: unitSuffix + original suffix
  const displaySuffix = unitSuffix + (suffix ? (unitSuffix ? ` ${suffix}` : suffix) : '');

  return `${sign}${prefix}${formatted}${displaySuffix}`;
}

/**
 * Formats a URL for display by removing protocol, www., and trailing slash
 * @example formatUrl("https://www.binance.com/docs/") => "binance.com/docs"
 */
export const formatUrl = (url: string) => {
  return url
    .replace(URL_PROTOCOL_PATTERN, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
};

export const formatDate = (
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
  locale = 'en-US'
) => {
  return new Date(date).toLocaleDateString(locale, options);
};

export enum timeUnits {
  milliseconds = 1,
  seconds = 1000,
  minutes = 60 * 1000,
  hours = 60 * 60 * 1000,
  days = 24 * 60 * 60 * 1000,
  weeks = 7 * 24 * 60 * 60 * 1000,
  months = 30 * 24 * 60 * 60 * 1000,
  years = 365 * 24 * 60 * 60 * 1000,
}

export const convertTimeUnits = (value: number, from: timeUnits, to: timeUnits): number => {
  return (value * from) / to;
};

/**
 * TODO: Remove this function and use formatAmount instead
 */
export function formatCompactNumber(value: number, maxFractionDigits = 1): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}
