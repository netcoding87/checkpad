CREATE TABLE "maintenance_case_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"staff_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "maintenance_case_staff_caseId_staffId_unique" UNIQUE("case_id","staff_id")
);
--> statement-breakpoint
ALTER TABLE "maintenance_case_staff" ADD CONSTRAINT "fk_maintenance_case_staff_case_id" FOREIGN KEY ("case_id") REFERENCES "public"."maintenance_cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenance_case_staff" ADD CONSTRAINT "fk_maintenance_case_staff_staff_id" FOREIGN KEY ("staff_id") REFERENCES "public"."staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "case_id_idx" ON "maintenance_case_staff" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "staff_id_idx" ON "maintenance_case_staff" USING btree ("staff_id");