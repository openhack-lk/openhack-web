import type { CollectionEntry } from 'astro:content';

export type StatusFilter = 'all' | 'upcoming' | 'ongoing' | 'past';

const STATUS_RANK: Record<CollectionEntry<'hackathons'>['data']['status'], number> = {
  upcoming: 0,
  ongoing: 0,
  past: 1,
};

/** Upcoming/ongoing first (soonest first), then past (most recently ended first). */
export function sortForListing(entries: CollectionEntry<'hackathons'>[]): CollectionEntry<'hackathons'>[] {
  return [...entries].sort((a, b) => {
    const rankDiff = STATUS_RANK[a.data.status] - STATUS_RANK[b.data.status];
    if (rankDiff !== 0) return rankDiff;

    const direction = a.data.status === 'past' ? -1 : 1;
    return direction * (a.data.startDate.getTime() - b.data.startDate.getTime());
  });
}

export function filterByStatus(
  entries: CollectionEntry<'hackathons'>[],
  status: StatusFilter,
): CollectionEntry<'hackathons'>[] {
  if (status === 'all') return entries;
  return entries.filter((entry) => entry.data.status === status);
}

export function parseStatusFilter(value: string | undefined): StatusFilter {
  return value === 'upcoming' || value === 'ongoing' || value === 'past' ? value : 'all';
}

export interface PageResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
}

export function paginate<T>(items: T[], page: number, perPage: number): PageResult<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return { items: items.slice(start, start + perPage), currentPage, totalPages };
}

export function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
