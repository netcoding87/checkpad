import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { db } from '@/db'
import { maintenanceCasesTable } from '@/db/schema'

config()

const seedUser = 'seed-script'

const cases = [
  {
    name: 'HVAC quarterly inspection',
    estimatedHours: 8.0,
    estimatedCosts: 1200.0,
    plannedStart: new Date('2025-11-25'),
    plannedEnd: new Date('2025-12-01'),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: new Date('2025-11-15T10:30:00Z'),
    offerAcceptedAt: new Date('2025-11-17T09:00:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-12-02T12:00:00Z'),
    invoicePaidAt: new Date('2025-12-08T12:00:00Z'),
    createdAt: new Date('2025-11-15T10:30:00Z'),
    updatedAt: new Date('2025-12-08T12:00:00Z'),
  },
  {
    name: 'Generator oil change',
    estimatedHours: 4.5,
    estimatedCosts: 650.0,
    plannedStart: new Date('2025-12-03'),
    plannedEnd: new Date('2025-12-08'),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: new Date('2025-11-20T09:15:00Z'),
    offerAcceptedAt: new Date('2025-11-21T15:45:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-12-09T09:00:00Z'),
    createdAt: new Date('2025-11-20T09:15:00Z'),
    updatedAt: new Date('2025-12-09T09:00:00Z'),
  },
  {
    name: 'Roof leak assessment',
    estimatedHours: 6.0,
    estimatedCosts: 1800.0,
    plannedStart: new Date('2025-12-10'),
    plannedEnd: new Date('2025-12-16'),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: new Date('2025-11-28T11:00:00Z'),
    createdAt: new Date('2025-11-28T11:00:00Z'),
    updatedAt: new Date('2025-11-28T11:00:00Z'),
  },
  {
    name: 'Elevator safety check',
    estimatedHours: 10.0,
    estimatedCosts: 2400.0,
    plannedStart: new Date('2025-12-15'),
    plannedEnd: new Date('2025-12-21'),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: new Date('2025-12-01T14:20:00Z'),
    offerAcceptedAt: new Date('2025-12-03T08:45:00Z'),
    createdAt: new Date('2025-12-01T14:20:00Z'),
    updatedAt: new Date('2025-12-03T08:45:00Z'),
  },
  {
    name: 'Fire alarm panel recertification',
    estimatedHours: 3.5,
    estimatedCosts: 950.0,
    plannedStart: new Date('2025-12-20'),
    plannedEnd: new Date('2025-12-26'),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: new Date('2025-12-05T10:00:00Z'),
    offerAcceptedAt: new Date('2025-12-06T16:00:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-12-27T10:30:00Z'),
    createdAt: new Date('2025-12-05T10:00:00Z'),
    updatedAt: new Date('2025-12-27T10:30:00Z'),
  },
  {
    name: 'Sprinkler system flush',
    estimatedHours: 7.0,
    estimatedCosts: 1350.0,
    plannedStart: new Date('2025-12-23'),
    plannedEnd: new Date('2025-12-30'),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: new Date('2025-12-12T09:45:00Z'),
    createdAt: new Date('2025-12-12T09:45:00Z'),
    updatedAt: new Date('2025-12-12T09:45:00Z'),
  },
  {
    name: 'Parking gate motor replacement',
    estimatedHours: 12.0,
    estimatedCosts: 3200.0,
    plannedStart: new Date('2026-01-05'),
    plannedEnd: new Date('2026-01-12'),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: new Date('2025-12-18T13:10:00Z'),
    offerAcceptedAt: new Date('2025-12-20T09:25:00Z'),
    createdAt: new Date('2025-12-18T13:10:00Z'),
    updatedAt: new Date('2025-12-20T09:25:00Z'),
  },
  {
    name: 'Chiller compressor diagnostics',
    estimatedHours: 5.0,
    estimatedCosts: 2100.0,
    plannedStart: new Date('2026-01-15'),
    plannedEnd: new Date('2026-01-20'),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: new Date('2025-12-22T15:00:00Z'),
    offerAcceptedAt: new Date('2025-12-23T11:30:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2026-01-21T10:00:00Z'),
    invoicePaidAt: new Date('2026-01-28T10:00:00Z'),
    createdAt: new Date('2025-12-22T15:00:00Z'),
    updatedAt: new Date('2026-01-28T10:00:00Z'),
  },
]

async function main() {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`TRUNCATE TABLE audit_log, maintenance_cases RESTART IDENTITY CASCADE`,
    )
    await tx.execute(sql.raw(`SET LOCAL "app.current_user" = '${seedUser}'`))
    await tx.insert(maintenanceCasesTable).values(cases)
  })

  console.log(`Seeded ${cases.length} maintenance cases`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
