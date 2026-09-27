CREATE TABLE "editorial_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"perfume_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"quick_overview" text DEFAULT '' NOT NULL,
	"scent_description" text DEFAULT '' NOT NULL,
	"note_breakdown" text DEFAULT '{}' NOT NULL,
	"scent_profile" text DEFAULT '{}' NOT NULL,
	"performance" text DEFAULT '' NOT NULL,
	"fragrance_development" text DEFAULT '' NOT NULL,
	"best_seasons" text DEFAULT '[]' NOT NULL,
	"best_occasions" text DEFAULT '[]' NOT NULL,
	"who_is_it_for" text DEFAULT '' NOT NULL,
	"strengths" text DEFAULT '[]' NOT NULL,
	"considerations" text DEFAULT '[]' NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"similar_fragrances" text DEFAULT '[]' NOT NULL,
	"take" text DEFAULT '' NOT NULL,
	"faq" text DEFAULT '[]' NOT NULL,
	"model" text DEFAULT '' NOT NULL,
	"prompt_version" text DEFAULT '' NOT NULL,
	"qc_report" text DEFAULT '[]' NOT NULL,
	"sources_count" integer DEFAULT 0 NOT NULL,
	"reviewed_by" text,
	"published_at" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "perfumes" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"brand" text NOT NULL,
	"concentration" text NOT NULL,
	"family" text NOT NULL,
	"house_url" text,
	"release_year" integer,
	"perfumer" text,
	"top_notes" text DEFAULT '[]' NOT NULL,
	"heart_notes" text DEFAULT '[]' NOT NULL,
	"base_notes" text DEFAULT '[]' NOT NULL,
	"image" text,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"perfume_id" text NOT NULL,
	"status" text DEFAULT 'running' NOT NULL,
	"step" text DEFAULT 'queued' NOT NULL,
	"facts_collected" integer DEFAULT 0 NOT NULL,
	"sources_used" integer DEFAULT 0 NOT NULL,
	"error" text,
	"started_at" text DEFAULT now() NOT NULL,
	"finished_at" text
);
--> statement-breakpoint
CREATE TABLE "retailer_offers" (
	"id" text PRIMARY KEY NOT NULL,
	"perfume_id" text NOT NULL,
	"retailer" text NOT NULL,
	"affiliate_url" text NOT NULL,
	"price_cents" integer,
	"original_price_cents" integer,
	"currency" text DEFAULT 'USD' NOT NULL,
	"discount_label" text,
	"availability" text DEFAULT 'unknown' NOT NULL,
	"last_checked" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT now() NOT NULL,
	"updated_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"perfume_id" text NOT NULL,
	"review_id" text,
	"source_type" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"facts" text DEFAULT '{}' NOT NULL,
	"last_checked" text,
	"http_status" integer,
	"created_at" text DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "editorial_reviews" ADD CONSTRAINT "editorial_reviews_perfume_id_perfumes_id_fk" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_runs" ADD CONSTRAINT "research_runs_perfume_id_perfumes_id_fk" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "retailer_offers" ADD CONSTRAINT "retailer_offers_perfume_id_perfumes_id_fk" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_sources" ADD CONSTRAINT "review_sources_perfume_id_perfumes_id_fk" FOREIGN KEY ("perfume_id") REFERENCES "public"."perfumes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_sources" ADD CONSTRAINT "review_sources_review_id_editorial_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."editorial_reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "editorial_reviews_perfume_idx" ON "editorial_reviews" USING btree ("perfume_id");--> statement-breakpoint
CREATE INDEX "editorial_reviews_status_idx" ON "editorial_reviews" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "perfumes_slug_key" ON "perfumes" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "perfumes_brand_idx" ON "perfumes" USING btree ("brand");--> statement-breakpoint
CREATE INDEX "research_runs_perfume_idx" ON "research_runs" USING btree ("perfume_id");--> statement-breakpoint
CREATE INDEX "retailer_offers_perfume_idx" ON "retailer_offers" USING btree ("perfume_id");--> statement-breakpoint
CREATE INDEX "review_sources_perfume_idx" ON "review_sources" USING btree ("perfume_id");