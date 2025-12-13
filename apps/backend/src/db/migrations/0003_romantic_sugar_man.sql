DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_reference_id_user_id_fk" FOREIGN KEY ("reference_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_reference_id_unique" UNIQUE("reference_id");