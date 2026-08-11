export interface PartnerIdentity {
  color: string;
  shortCode: string;
}

interface KnownPartner extends PartnerIdentity {
  match: string[];
  fullName: string;
}

/**
 * Hackathons on this platform aren't only university-run - student chapters
 * (IEEE, SEDS) and companies (WSO2, Cursor, Google Developer Groups) co-organize
 * or sponsor plenty of them. We don't have licensed logo assets for these, so - same
 * approach as unknown universities - they get a hand-picked colored initial chip
 * instead of a scraped trademark image.
 */
const KNOWN_PARTNERS: KnownPartner[] = [
  { match: ['wso2'], fullName: 'WSO2', color: '#ff7300', shortCode: 'WSO2' },
  { match: ['ieee'], fullName: 'IEEE', color: '#00629b', shortCode: 'IEEE' },
  { match: ['seds'], fullName: 'SEDS', color: '#7c3aed', shortCode: 'SEDS' },
  { match: ['cursor'], fullName: 'Cursor', color: '#18181b', shortCode: 'CUR' },
  { match: ['google developer group', 'gdg'], fullName: 'Google Developer Groups', color: '#4285f4', shortCode: 'GDG' },
  { match: ['github'], fullName: 'GitHub Education', color: '#24292f', shortCode: 'GH' },
];

function hashHue(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 360;
}

export function getPartnerIdentity(name: string): PartnerIdentity {
  const lower = name.toLowerCase();
  const known = KNOWN_PARTNERS.find((p) => p.match.some((alias) => lower.includes(alias)));
  if (known) return { color: known.color, shortCode: known.shortCode };

  return {
    color: `hsl(${hashHue(name)} 50% 42%)`,
    shortCode: name.slice(0, 3).toUpperCase(),
  };
}

/** Curated list for the homepage partners strip. */
export function getFeaturedPartners(): { name: string; color: string; shortCode: string }[] {
  return KNOWN_PARTNERS.map((p) => ({ name: p.fullName, color: p.color, shortCode: p.shortCode }));
}
