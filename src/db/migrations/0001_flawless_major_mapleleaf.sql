CREATE TABLE "competition_timeline" (
	"id" serial PRIMARY KEY NOT NULL,
	"competition_id" text NOT NULL,
	"date" text NOT NULL,
	"title" text NOT NULL,
	"desc" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "type" text DEFAULT 'individual';--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "max_team_members" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "min_team_members" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "competitions" ADD COLUMN "members_required" text DEFAULT 'optional';--> statement-breakpoint
ALTER TABLE "competition_timeline" ADD CONSTRAINT "competition_timeline_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE cascade ON UPDATE no action;