import {
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const maintenanceCases = pgTable('maintenance_cases', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  estimatedHours: numeric('estimated_hours', { precision: 10, scale: 2 }),
  estimatedCosts: numeric('estimated_costs', { precision: 12, scale: 2 }),
  plannedStart: timestamp('planned_start'),
  plannedEnd: timestamp('planned_end'),
  offerCreatedBy: text('offer_created_by'),
  offerCreatedAt: timestamp('offer_created_at'),
  offerAcceptedAt: timestamp('offer_accepted_at'),
  invoiceCreatedBy: text('invoice_created_by'),
  invoiceCreatedAt: timestamp('invoice_created_at'),
  invoicePaidAt: timestamp('invoice_paid_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  tableName: text('table_name').notNull(),
  recordId: uuid('record_id').notNull(),
  columnName: text('column_name').notNull(),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  changedBy: text('changed_by'),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
})
