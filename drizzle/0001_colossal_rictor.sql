ALTER TABLE "maintenance_cases" ALTER COLUMN "estimated_hours" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "maintenance_cases" ALTER COLUMN "estimated_costs" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "maintenance_cases" ALTER COLUMN "planned_start" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenance_cases" ALTER COLUMN "planned_end" SET NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_id_idx" ON "audit_log" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "maintenance_cases" USING btree ("name");
