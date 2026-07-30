/**
 * General purpose formatting helpers for currency, dates, headers, and error messages
 */

/**
 * Format numeric value as USD currency string (e.g., $1,250)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Safely extract error message string from unknown catch block error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred.';
}

/**
 * Safely parse date value from Excel raw data or Date object into YYYY-MM-DD
 */
export function formatDate(val: unknown, fallback: string = ''): string {
  if (!val) return fallback;
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return fallback;
    return val.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  return str || fallback;
}

/**
 * Safely parse date value from Excel raw data or Date object into YYYY
 */
export function formatYear(val: unknown, fallback: string = ''): string {
  if (!val) return fallback;

  if (val instanceof Date) {
    if (isNaN(val.getTime())) return fallback;
    return String(val.getFullYear());
  }

  const str = String(val).trim();
  if (!str) return fallback;

  // Try parsing as a date string
  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    return String(date.getFullYear());
  }

  // If already a year like "2024"
  if (/^\d{4}$/.test(str)) {
    return str;
  }

  return fallback;
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
