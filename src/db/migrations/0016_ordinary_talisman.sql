CREATE TABLE "journey_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"journey_id" text NOT NULL,
	"url" text NOT NULL,
	"caption" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "journey_photos" ADD CONSTRAINT "journey_photos_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "journey_photos_journey_id_idx" ON "journey_photos" USING btree ("journey_id");