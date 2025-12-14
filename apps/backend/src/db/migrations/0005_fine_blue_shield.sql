CREATE TABLE "certificates" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"certificate_number" text NOT NULL,
	"pdf_url" text NOT NULL,
	"qr_code" text,
	"hash_sha256" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "certificates_certificate_number_unique" UNIQUE("certificate_number")
);
--> statement-breakpoint
CREATE TABLE "checklist_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"checklist_type" text NOT NULL,
	"responses" jsonb NOT NULL,
	"approved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donation_analyses" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"image_data" text,
	"text_input" text,
	"ai_response" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donation_matches" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_id" text NOT NULL,
	"ong_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"accepted_at" timestamp,
	"collected_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" text PRIMARY KEY NOT NULL,
	"doador_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"tipo_alimento" text NOT NULL,
	"descricao" text,
	"quantidade" text,
	"temperatura" text,
	"prazo_consumo" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_suggestions" (
	"id" text PRIMARY KEY NOT NULL,
	"donation_match_id" text NOT NULL,
	"recipe_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_donation_id_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist_responses" ADD CONSTRAINT "checklist_responses_donation_id_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donation_analyses" ADD CONSTRAINT "donation_analyses_donation_id_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donation_matches" ADD CONSTRAINT "donation_matches_donation_id_donations_id_fk" FOREIGN KEY ("donation_id") REFERENCES "public"."donations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donation_matches" ADD CONSTRAINT "donation_matches_ong_id_user_id_fk" FOREIGN KEY ("ong_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_doador_id_user_id_fk" FOREIGN KEY ("doador_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_suggestions" ADD CONSTRAINT "recipe_suggestions_donation_match_id_donation_matches_id_fk" FOREIGN KEY ("donation_match_id") REFERENCES "public"."donation_matches"("id") ON DELETE cascade ON UPDATE no action;