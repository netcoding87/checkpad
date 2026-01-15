import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
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
    estimatedHours: doublePrecision(),
    estimatedCosts: doublePrecision(),
    plannedStart: timestamp().notNull(),
    plannedEnd: timestamp().notNull(),
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

export const staffTable = pgTable(
  'staff',
  {
    id: uuid().defaultRandom().primaryKey(),
    firstName: text().notNull(),
    lastName: text().notNull(),
    email: text().notNull().unique(),
    phone: text(),
    birthday: timestamp(),
    hourlyRate: doublePrecision(),
    vacationDaysTotal: integer().default(30),
    vacationDaysUsed: integer().default(0),
    sickDaysUsed: integer().default(0),
    isActive: boolean().default(true),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [index('email_idx').on(table.email)],
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
