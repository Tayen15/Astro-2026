import { z } from 'zod';

export const prizeSchema = z.object({
  label: z.string(),
  value: z.string(),
});

/** Body for creating/updating a competition (admin). */
export const competitionInputSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  tagline: z.string().optional().default(''),
  description: z.string().optional().default(''),
  fee: z.number().int().min(0).optional().default(0),
  maxSlots: z.number().int().min(0).optional().default(0),
  filledSlots: z.number().int().min(0).optional().default(0),
  scheduleDate: z.string().datetime().optional().nullable(),
  location: z.string().optional().default(''),
  prizesFirst: z.string().optional().default(''),
  prizesSecond: z.string().optional().default(''),
  prizesThird: z.string().optional().default(''),
  prizes: z.array(prizeSchema).optional().default([]),
  rulesSummary: z.array(z.string()).optional().default([]),
  rulebookUrl: z.string().optional().default(''),
  contactName: z.string().optional().default(''),
  contactWhatsapp: z.string().optional().default(''),
  type: z.enum(['individual', 'team']).optional().default('individual'),
  maxTeamMembers: z.number().int().min(1).optional().default(1),
  minTeamMembers: z.number().int().min(1).optional().default(1),
  membersRequired: z.enum(['optional', 'required']).optional().default('optional'),
  isFree: z.boolean().optional().default(false),
  origin: z.enum(['internal', 'external']).optional().default('internal'),
  certificateEnabled: z.boolean().optional().default(false),
  certificateType: z.enum(['winner', 'all']).optional().default('winner'),
  certificateTemplate: z.string().nullable().optional().default(null),
  isActive: z.boolean().optional().default(true),
});

export type CompetitionInput = z.infer<typeof competitionInputSchema>;

/** Zod schema for the timeline item body (admin). */
export const timelineItemSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
  sortOrder: z.number().int().optional(),
});

export type TimelineItem = z.infer<typeof timelineItemSchema>;
