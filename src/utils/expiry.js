import { differenceInDays, isToday, isPast, format } from 'date-fns';
import { EXPIRY_THRESHOLDS } from './constants';

/**
 * Determine the expiry status of an item.
 * @param {string|Date|null} expiryDate - The expiry date to check
 * @returns {'expired'|'warning'|'fresh'|null} Status string or null if no date
 */
export function getExpiryStatus(expiryDate) {
  if (!expiryDate) return null;
  const date = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (isPast(date) && !isToday(date)) return 'expired';
  if (isToday(date)) return 'warning';

  const daysLeft = differenceInDays(date, today);
  if (daysLeft <= EXPIRY_THRESHOLDS.WARNING_DAYS) return 'warning';
  return 'fresh';
}

/**
 * Calculate the number of days until an item expires.
 * Negative values indicate days past expiry.
 * @param {string|Date|null} expiryDate - The expiry date
 * @returns {number|null} Days until expiry, or null if no date
 */
export function daysUntilExpiry(expiryDate) {
  if (!expiryDate) return null;
  const date = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return differenceInDays(date, today);
}

/**
 * Get a human-readable, i18n-aware expiry label.
 * @param {string|Date|null} expiryDate - The expiry date
 * @param {Function} t - i18next translation function
 * @returns {string} Localized expiry label
 */
export function formatExpiryLabel(expiryDate, t) {
  if (!expiryDate) return t('expiry.noExpiry');
  const days = daysUntilExpiry(expiryDate);

  if (days === 0) return t('expiry.expiresToday');
  if (days > 0) return t('expiry.daysLeft', { count: days });
  return t('expiry.expiredDaysAgo', { count: Math.abs(days) });
}

/**
 * Format a date to a readable string (e.g., "May 24, 2026").
 * @param {string|Date|null} date - The date to format
 * @returns {string} Formatted date string or empty string
 */
export function formatDate(date) {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
}
