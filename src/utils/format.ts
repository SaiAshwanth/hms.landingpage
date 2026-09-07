/**
 * Utility formatting functions for Aurelia Nova frontend
 */

export function formatExperienceYears(years: number): string {
  return `${years}+ Years Experience`;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTimeSlot(time: string): string {
  return time;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
