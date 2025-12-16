CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"record_id" uuid NOT NULL,
	"column_name" text NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"changed_by" text,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"estimated_hours" numeric(10, 2),
	"estimated_costs" numeric(12, 2),
	"planned_start" timestamp,
	"planned_end" timestamp,
	"offer_created_by" text,
	"offer_created_at" timestamp,
	"offer_accepted_at" timestamp,
	"invoice_created_by" text,
	"invoice_created_at" timestamp,
	"invoice_paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
