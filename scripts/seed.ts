import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { db } from '@/db'
import { maintenanceCasesTable } from '@/db/schema'

config()

const seedUser = 'seed-script'

const cases = [
  {
    name: 'HVAC quarterly inspection',
    estimatedHours: '8.0',
    estimatedCosts: '1200.00',
    plannedStart: new Date('2025-01-15T08:00:00Z'),
    plannedEnd: new Date('2025-01-15T17:00:00Z'),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: new Date('2025-01-05T10:30:00Z'),
    offerAcceptedAt: new Date('2025-01-07T09:00:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-01-16T12:00:00Z'),
    invoicePaidAt: new Date('2025-01-20T12:00:00Z'),
    createdAt: new Date('2025-01-05T10:30:00Z'),
    updatedAt: new Date('2025-01-20T12:00:00Z'),
  },
  {
    name: 'Generator oil change',
    estimatedHours: '4.5',
    estimatedCosts: '650.00',
    plannedStart: new Date('2025-02-02T07:30:00Z'),
    plannedEnd: new Date('2025-02-02T12:30:00Z'),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: new Date('2025-01-20T09:15:00Z'),
    offerAcceptedAt: new Date('2025-01-21T15:45:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-02-03T09:00:00Z'),
    createdAt: new Date('2025-01-20T09:15:00Z'),
    updatedAt: new Date('2025-02-03T09:00:00Z'),
  },
  {
    name: 'Roof leak assessment',
    estimatedHours: '6.0',
    estimatedCosts: '1800.00',
    plannedStart: new Date('2025-02-10T08:00:00Z'),
    plannedEnd: new Date('2025-02-10T15:00:00Z'),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: new Date('2025-01-28T11:00:00Z'),
    createdAt: new Date('2025-01-28T11:00:00Z'),
    updatedAt: new Date('2025-01-28T11:00:00Z'),
  },
  {
    name: 'Elevator safety check',
    estimatedHours: '10.0',
    estimatedCosts: '2400.00',
    plannedStart: new Date('2025-02-18T07:00:00Z'),
    plannedEnd: new Date('2025-02-18T18:00:00Z'),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: new Date('2025-02-01T14:20:00Z'),
    offerAcceptedAt: new Date('2025-02-03T08:45:00Z'),
    createdAt: new Date('2025-02-01T14:20:00Z'),
    updatedAt: new Date('2025-02-03T08:45:00Z'),
  },
  {
    name: 'Fire alarm panel recertification',
    estimatedHours: '3.5',
    estimatedCosts: '950.00',
    plannedStart: new Date('2025-02-25T09:00:00Z'),
    plannedEnd: new Date('2025-02-25T12:30:00Z'),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: new Date('2025-02-05T10:00:00Z'),
    offerAcceptedAt: new Date('2025-02-06T16:00:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-02-27T10:30:00Z'),
    createdAt: new Date('2025-02-05T10:00:00Z'),
    updatedAt: new Date('2025-02-27T10:30:00Z'),
  },
  {
    name: 'Sprinkler system flush',
    estimatedHours: '7.0',
    estimatedCosts: '1350.00',
    plannedStart: new Date('2025-03-04T08:30:00Z'),
    plannedEnd: new Date('2025-03-04T16:00:00Z'),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: new Date('2025-02-12T09:45:00Z'),
    createdAt: new Date('2025-02-12T09:45:00Z'),
    updatedAt: new Date('2025-02-12T09:45:00Z'),
  },
  {
    name: 'Parking gate motor replacement',
    estimatedHours: '12.0',
    estimatedCosts: '3200.00',
    plannedStart: new Date('2025-03-12T07:00:00Z'),
    plannedEnd: new Date('2025-03-13T16:00:00Z'),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: new Date('2025-02-18T13:10:00Z'),
    offerAcceptedAt: new Date('2025-02-20T09:25:00Z'),
    createdAt: new Date('2025-02-18T13:10:00Z'),
    updatedAt: new Date('2025-02-20T09:25:00Z'),
  },
  {
    name: 'Chiller compressor diagnostics',
    estimatedHours: '5.0',
    estimatedCosts: '2100.00',
    plannedStart: new Date('2025-03-20T08:00:00Z'),
    plannedEnd: new Date('2025-03-20T14:00:00Z'),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: new Date('2025-02-22T15:00:00Z'),
    offerAcceptedAt: new Date('2025-02-23T11:30:00Z'),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: new Date('2025-03-21T10:00:00Z'),
    invoicePaidAt: new Date('2025-03-28T10:00:00Z'),
    createdAt: new Date('2025-02-22T15:00:00Z'),
    updatedAt: new Date('2025-03-28T10:00:00Z'),
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
