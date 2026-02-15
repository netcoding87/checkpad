import {
  boolean,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
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

export const maintenanceCaseStaffTable = pgTable(
  'maintenance_case_staff',
  {
    id: uuid().defaultRandom().primaryKey(),
    caseId: uuid().notNull(),
    staffId: uuid().notNull(),
    assignedAt: timestamp().defaultNow().notNull(),
    assignedBy: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    unique().on(table.caseId, table.staffId),
    index('case_id_idx').on(table.caseId),
    index('staff_id_idx').on(table.staffId),
    foreignKey({
      columns: [table.caseId],
      foreignColumns: [maintenanceCasesTable.id],
      name: 'fk_maintenance_case_staff_case_id',
    }),
    foreignKey({
      columns: [table.staffId],
      foreignColumns: [staffTable.id],
      name: 'fk_maintenance_case_staff_staff_id',
    }),
  ],
)
