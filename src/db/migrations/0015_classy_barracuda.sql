ALTER TABLE "competitions" DROP CONSTRAINT "competitions_category_fkey";
--> statement-breakpoint
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_competition_id_competitions_id_fk";
--> statement-breakpoint
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_division_committee_divisions_slug_fk" FOREIGN KEY ("division") REFERENCES "public"."committee_divisions"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_category_gallery_categories_slug_fk" FOREIGN KEY ("category") REFERENCES "public"."gallery_categories"("slug") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "committee_members_division_idx" ON "committee_members" USING btree ("division");--> statement-breakpoint
CREATE INDEX "competition_timeline_competition_id_idx" ON "competition_timeline" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "competitions_category_idx" ON "competitions" USING btree ("category");--> statement-breakpoint
CREATE INDEX "gallery_photos_category_idx" ON "gallery_photos" USING btree ("category");--> statement-breakpoint
CREATE INDEX "registrations_competition_id_idx" ON "registrations" USING btree ("competition_id");--> statement-breakpoint
CREATE INDEX "registrations_user_id_idx" ON "registrations" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_account_unique" UNIQUE("provider_id","account_id");