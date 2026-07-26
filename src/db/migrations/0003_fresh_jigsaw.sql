ALTER TABLE "competitions" ADD COLUMN "is_free" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "origin" text DEFAULT 'internal';