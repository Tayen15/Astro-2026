ALTER TABLE "registrations" ADD COLUMN "is_winner" text DEFAULT '0';--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "winner_rank" text;--> statement-breakpoint
ALTER TABLE "registrations" ADD COLUMN "certificate_sent" text DEFAULT '0';