export interface UniversityIdentity {
  color: string;
  shortCode: string;
  logo?: string;
}

interface KnownUniversity extends UniversityIdentity {
  match: string[];
  fullName: string;
}

/**
 * Known Sri Lankan universities get a hand-picked identity color + short code,
 * and a crest logo where we have one (public/universities/*.webp).
 * Match against multiple aliases since organizerUniversity may be a full official
 * name ("Sri Lanka Institute of Information Technology") or a common short form.
 * Anything unmatched falls back to a deterministic color/initials so a new mock
 * entry (or a real one from a future API) still renders with zero code changes.
 */
const KNOWN_UNIVERSITIES: KnownUniversity[] = [
  {
    match: ['moratuwa'],
    fullName: 'University of Moratuwa',
    color: '#7a1f2e',
    shortCode: 'UoM',
    logo: '/universities/uom.webp',
  },
  {
    match: ['sliit', 'sri lanka institute of information technology'],
    fullName: 'Sri Lanka Institute of Information Technology',
    color: '#1d4ed8',
    shortCode: 'SLIIT',
    logo: '/universities/sliit.webp',
  },
  {
    match: ['colombo'],
    fullName: 'University of Colombo School of Computing',
    color: '#4338ca',
    shortCode: 'UCSC',
    logo: '/universities/ucsc.webp',
  },
  {
    match: ['peradeniya'],
    fullName: 'University of Peradeniya',
    color: '#15803d',
    shortCode: 'UoP',
  },
  {
    match: ['kelaniya'],
    fullName: 'University of Kelaniya',
    color: '#c2410c',
    shortCode: 'UoK',
    logo: '/universities/uok.webp',
  },
  {
    match: ['informatics institute of technology', 'iit'],
    fullName: 'Informatics Institute of Technology',
    color: '#dc2626',
    shortCode: 'IIT',
    logo: '/universities/iit.webp',
  },
  {
    match: ['kotelawala', 'kdu', 'defence university'],
    fullName: 'General Sir John Kotelawala Defence University',
    color: '#1e2a5e',
    shortCode: 'KDU',
    logo: '/universities/kdu.webp',
  },
  {
    match: ['jayewardenepura'],
    fullName: 'University of Sri Jayewardenepura',
    color: '#a16207',
    shortCode: 'USJP',
    logo: '/universities/usjp.webp',
  },
];

function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

function fallbackShortCode(name: string): string {
  const words = name
    .replace(/^University of\s+/i, '')
    .split(/\s+/)
    .filter(Boolean);
  return words
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

export function getUniversityIdentity(name: string): UniversityIdentity {
  const lower = name.toLowerCase();
  const known = KNOWN_UNIVERSITIES.find((u) => u.match.some((alias) => lower.includes(alias)));
  if (known) return { color: known.color, shortCode: known.shortCode, logo: known.logo };

  return {
    color: `hsl(${hashHue(name)} 55% 38%)`,
    shortCode: fallbackShortCode(name) || name.slice(0, 2).toUpperCase(),
  };
}

/** Universities with an on-file crest logo, for use in marquees/logo strips. */
export function getUniversityLogos(): { name: string; logo: string; color: string }[] {
  return KNOWN_UNIVERSITIES.filter((u) => u.logo).map((u) => ({
    name: u.fullName,
    logo: u.logo!,
    color: u.color,
  }));
}
