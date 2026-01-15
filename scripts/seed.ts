import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { db } from '@/db'
import { maintenanceCasesTable, staffTable } from '@/db/schema'

config()

const seedUser = 'seed-script'

const staff = [
  {
    firstName: 'Julia',
    lastName: 'Hartmann',
    email: 'julia.hartmann@company.com',
    phone: '+49-30-12345678',
    birthday: new Date('1990-05-15'),
    hourlyRate: 85.0,
    vacationDaysTotal: 30,
    vacationDaysUsed: 8,
    sickDaysUsed: 2,
    isActive: true,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  },
  {
    firstName: 'Marco',
    lastName: 'Richter',
    email: 'marco.richter@company.com',
    phone: '+49-30-12345679',
    birthday: new Date('1988-03-22'),
    hourlyRate: 90.0,
    vacationDaysTotal: 30,
    vacationDaysUsed: 12,
    sickDaysUsed: 1,
    isActive: true,
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-01-20T10:00:00Z'),
  },
  {
    firstName: 'Svenja',
    lastName: 'Vogel',
    email: 'svenja.vogel@company.com',
    phone: '+49-30-12345680',
    birthday: new Date('1992-11-08'),
    hourlyRate: 80.0,
    vacationDaysTotal: 30,
    vacationDaysUsed: 5,
    sickDaysUsed: 0,
    isActive: true,
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T10:00:00Z'),
  },
  {
    firstName: 'Anna',
    lastName: 'Lenz',
    email: 'anna.lenz@company.com',
    phone: '+49-30-12345681',
    birthday: new Date('1995-07-30'),
    hourlyRate: 75.0,
    vacationDaysTotal: 30,
    vacationDaysUsed: 10,
    sickDaysUsed: 3,
    isActive: true,
    createdAt: new Date('2024-02-10T10:00:00Z'),
    updatedAt: new Date('2024-02-10T10:00:00Z'),
  },
  {
    firstName: 'Thomas',
    lastName: 'Schmidt',
    email: 'thomas.schmidt@company.com',
    phone: '+49-30-12345682',
    birthday: new Date('1985-09-12'),
    hourlyRate: 95.0,
    vacationDaysTotal: 30,
    vacationDaysUsed: 15,
    sickDaysUsed: 0,
    isActive: true,
    createdAt: new Date('2024-03-05T10:00:00Z'),
    updatedAt: new Date('2024-03-05T10:00:00Z'),
  },
]

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
      sql`TRUNCATE TABLE audit_log, maintenance_cases, staff RESTART IDENTITY CASCADE`,
    )
    await tx.execute(sql.raw(`SET LOCAL "app.current_user" = '${seedUser}'`))
    await tx.insert(staffTable).values(staff)
    await tx.insert(maintenanceCasesTable).values(cases)
  })

  console.log(
    `Seeded ${staff.length} staff members and ${cases.length} maintenance cases`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
