const day = (d: Date) => d.getUTCDate();
const month = (d: Date, style: 'short' | 'long' = 'long') =>
  d.toLocaleDateString('en-GB', { month: style, timeZone: 'UTC' });
const year = (d: Date) => d.getUTCFullYear();

/** Formats a date range like "12-14 July 2026" or "28 Jun - 2 Jul 2026"; a single day collapses to "12 July 2026". */
export function formatDateRange(start: Date, end: Date): string {
  const sameYear = year(start) === year(end);
  const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
  const sameDay = sameMonth && day(start) === day(end);

  if (sameDay) {
    return `${day(start)} ${month(start)} ${year(start)}`;
  }

  if (sameMonth) {
    return `${day(start)}-${day(end)} ${month(start)} ${year(end)}`;
  }

  if (sameYear) {
    return `${day(start)} ${month(start, 'short')} - ${day(end)} ${month(end, 'short')} ${year(end)}`;
  }

  return `${day(start)} ${month(start, 'short')} ${year(start)} - ${day(end)} ${month(end, 'short')} ${year(end)}`;
}
