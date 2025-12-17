import {
  index,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'

export const maintenanceCasesTable = pgTable(
  'maintenance_cases',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    estimatedHours: numeric({ precision: 10, scale: 2 }),
    estimatedCosts: numeric({ precision: 12, scale: 2 }),
    plannedStart: timestamp(),
    plannedEnd: timestamp(),
    offerCreatedBy: text(),
    offerCreatedAt: timestamp(),
    offerAcceptedAt: timestamp(),
    invoiceCreatedBy: text(),
    invoiceCreatedAt: timestamp(),
    invoicePaidAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [index('name_idx').on(table.name)],
)

export const auditLogTable = pgTable(
  'audit_log',
  {
    id: serial().primaryKey(),
    tableName: text().notNull(),
    recordId: uuid().notNull(),
    columnName: text().notNull(),
    oldValue: jsonb(),
    newValue: jsonb(),
    changedBy: text(),
    changedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [index('record_id_idx').on(table.recordId)],
)
