CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"birthday" timestamp,
	"hourly_rate" double precision,
	"vacation_days_total" integer DEFAULT 30,
	"vacation_days_used" integer DEFAULT 0,
	"sick_days_used" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "staff_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "maintenance_cases" ALTER COLUMN "planned_start" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "maintenance_cases" ALTER COLUMN "planned_end" SET DATA TYPE timestamp;--> statement-breakpoint
CREATE INDEX "email_idx" ON "staff" USING btree ("email");