import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const hackathons = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hackathons' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    organizerName: z.string(), // e.g. "CodeX"
    organizerUniversity: z.string(), // e.g. "University of Moratuwa"
    description: z.string(), // short summary, ~2-3 sentences
    bannerImage: z.string().optional(),
    externalUrl: z.url(), // link to the hackathon's own site
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    mode: z.enum(['online', 'onsite', 'hybrid']),
    location: z.string().optional(), // city/venue if onsite/hybrid
    whoCanParticipate: z.string().optional(), // e.g. "Undergraduates from any Sri Lankan university"
    partners: z.array(z.string()).default([]), // co-organizing/sponsoring orgs, e.g. ["WSO2", "IEEE UOM Student Branch"]
    duration: z.string().optional(), // for single-stage events, e.g. "24 hrs", "48 hrs" - ignored if `phases` is set
    phases: z
      .array(
        z.object({
          name: z.string(), // e.g. "Phase 1: Online Qualifiers", "Final Round"
          when: z.string(), // free text, e.g. "1-15 September 2026" or "Announced after Phase 1"
          duration: z.string().optional(), // e.g. "48 hrs"
        }),
      )
      .default([]), // multi-round hackathons: qualifiers -> semis -> final, etc.
    tags: z.array(z.string()).default([]), // e.g. ["AI", "Blockchain", "Beginner-friendly"]
    status: z.enum(['upcoming', 'ongoing', 'past']).default('upcoming'),
    featured: z.boolean().default(false),
    themeColor: z
      .string()
      .regex(/^#[0-9a-f]{6}$/i)
      .optional(), // per-university/organizer accent override, e.g. "#7a1f2b"; falls back to site accent if omitted
  }),
});

export const collections = { hackathons };
