import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  integer,
  timestamp,
  uuid,
  jsonb,
  serial,
} from 'drizzle-orm/pg-core';

/* ─── Categories ─── */
export const categories = pgTable('categories', {
  id: text('id').primaryKey(), // 'akademik' | 'olahraga' | 'esports' | custom
  label: text('label').notNull(), // 'Akademik' | 'Olahraga' | 'Esports'
  color: text('color').notNull().default('text-cyan-700 bg-cyan-50 border-cyan-200'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  competitions: many(competitions),
}));

/* ─── Competitions ─── */
export const competitions = pgTable('competitions', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category')
    .notNull()
    .references(() => categories.id),
  tagline: text('tagline'),
  description: text('description'),
  fee: integer('fee').notNull().default(0),
  maxSlots: integer('max_slots').notNull().default(0),
  filledSlots: integer('filled_slots').notNull().default(0),
  scheduleDate: timestamp('schedule_date'),
  location: text('location'),
  prizesFirst: text('prizes_first'),
  prizesSecond: text('prizes_second'),
  prizesThird: text('prizes_third'),
  rulesSummary: jsonb('rules_summary').$type<string[]>(),
  rulebookUrl: text('rulebook_url'),
  contactName: text('contact_name'),
  contactWhatsapp: text('contact_whatsapp'),
  isActive: text('is_active').notNull().default('1'), // '1' = active, '0' = inactive
  type: text('type').default('individual'), // 'individual' | 'team'
  maxTeamMembers: integer('max_team_members').default(1),
  minTeamMembers: integer('min_team_members').default(1),
  membersRequired: text('members_required').default('optional'), // 'optional' | 'required'
  isFree: text('is_free').default('0'), // '0' = bayar, '1' = gratis
  origin: text('origin').default('internal'), // 'internal' | 'external'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const competitionsRelations = relations(competitions, ({ many }) => ({
  registrations: many(registrations),
  timeline: many(competitionTimeline),
}));

/* ─── Registrations ─── */
export const registrations = pgTable('registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  competitionId: text('competition_id')
    .notNull()
    .references(() => competitions.id),
  type: text('type').notNull(), // 'team' | 'individual'
  // Individual fields
  fullName: text('full_name'),
  identityNumber: text('identity_number'),
  // Team fields
  teamName: text('team_name'),
  leaderName: text('leader_name'),
  leaderIdentity: text('leader_identity'),
  members: text('members'),
  // Common fields
  institution: text('institution').notNull(),
  email: text('email').notNull(),
  whatsapp: text('whatsapp').notNull(),
  // Payment
  paymentStatus: text('payment_status').notNull().default('pending'), // 'pending' | 'detecting' | 'paid' | 'failed'
  paymentMethod: text('payment_method'), // 'qris' | 'transfer'
  paymentAmount: integer('payment_amount').notNull(),
  paymentReference: text('payment_reference'),
  // User link
  userId: uuid('user_id'),
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const registrationsRelations = relations(registrations, ({ one }) => ({
  competition: one(competitions, {
    fields: [registrations.competitionId],
    references: [competitions.id],
  }),
}));

/* ─── Competition Timeline ─── */
export const competitionTimeline = pgTable('competition_timeline', {
  id: serial('id').primaryKey(),
  competitionId: text('competition_id')
    .notNull()
    .references(() => competitions.id, { onDelete: 'cascade' }),
  date: text('date').notNull(),
  title: text('title').notNull(),
  desc: text('desc').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const competitionTimelineRelations = relations(competitionTimeline, ({ one }) => ({
  competition: one(competitions, {
    fields: [competitionTimeline.competitionId],
    references: [competitions.id],
  }),
}));

/* ─── Users ─── */
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').notNull().default('participant'), // 'admin' | 'participant'
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  registrations: many(registrations),
}));

/* ─── FAQs ─── */
export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').default(0),
});

/* ─── OTP Codes ─── */
export const otpCodes = pgTable('otp_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  code: text('code').notNull(),
  name: text('name'),
  password: text('password'),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Sponsors ─── */
export const sponsors = pgTable('sponsors', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  tier: text('tier').notNull().default('gold'), // 'platinum' | 'gold' | 'silver'
  website: text('website'),
  logo: text('logo'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Media Partners ─── */
export const mediaPartners = pgTable('media_partners', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  website: text('website'),
  logo: text('logo'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Gallery Categories ─── */
export const galleryCategories = pgTable('gallery_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Committee Divisions ─── */
export const committeeDivisions = pgTable('committee_divisions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortName: text('short_name'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Journeys ─── */
export const journeys = pgTable('journeys', {
  id: text('id').primaryKey(), // e.g. '2023', '2024'
  theme: text('theme').notNull(),
  participants: integer('participants').default(0),
  universities: integer('universities').default(0),
  competitionsCount: integer('competitions_count').default(0),
  achievement: text('achievement'),
  description: text('description'),
  highlights: jsonb('highlights').$type<string[]>(),
  isActive: text('is_active').default('1'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Gallery Photos ─── */
export const galleryPhotos = pgTable('gallery_photos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), // FK -> gallery_categories.slug
  imageUrl: text('image_url').notNull(),
  year: text('year').notNull(),
  likesCount: integer('likes_count').default(0),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

/* ─── Committee Members ─── */
export const committeeMembers = pgTable('committee_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(), // jabatan (e.g. 'Ketua Pelaksana', 'Staf')
  division: text('division').notNull(), // FK -> committee_divisions.slug
  divisionName: text('division_name').notNull(),
  image: text('image').notNull(),
  isLeader: text('is_leader').default('0'), // '0' | '1' — controls tipe (Koordinator/Staf)
  quote: text('quote'),
  instagram: text('instagram'),
  linkedin: text('linkedin'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
