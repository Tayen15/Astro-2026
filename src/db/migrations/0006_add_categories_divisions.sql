CREATE TABLE "committee_divisions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "committee_divisions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "gallery_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "gallery_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "gallery_categories_slug_unique" UNIQUE("slug")
);
