ALTER TABLE "committee_members" DROP CONSTRAINT "committee_members_division_committee_divisions_slug_fk";
--> statement-breakpoint
ALTER TABLE "committee_members" ADD COLUMN "study_program" text;--> statement-breakpoint
ALTER TABLE "committee_members" ADD COLUMN "batch" text;--> statement-breakpoint
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_division_committee_divisions_slug_fk" FOREIGN KEY ("division") REFERENCES "public"."committee_divisions"("slug") ON DELETE cascade ON UPDATE cascade;