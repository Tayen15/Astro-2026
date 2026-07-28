ALTER TABLE "competitions" ADD COLUMN "certificate_enabled" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "certificate_type" text DEFAULT 'winner';