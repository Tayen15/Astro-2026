CREATE TABLE "committee_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"division" text NOT NULL,
	"division_name" text NOT NULL,
	"image" text NOT NULL,
	"is_leader" text DEFAULT '0',
	"quote" text,
	"instagram" text,
	"linkedin" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"year" text NOT NULL,
	"likes_count" integer DEFAULT 0,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journeys" (
	"id" text PRIMARY KEY NOT NULL,
	"theme" text NOT NULL,
	"participants" integer DEFAULT 0,
	"universities" integer DEFAULT 0,
	"competitions_count" integer DEFAULT 0,
	"achievement" text,
	"description" text,
	"highlights" jsonb,
	"is_active" text DEFAULT '1',
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
