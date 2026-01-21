import { config } from 'dotenv'
import { sql } from 'drizzle-orm'

import { db } from '@/db'
import { maintenanceCasesTable, staffTable } from '@/db/schema'

config()

const seedUser = 'seed-script'

// Calculate date ranges based on current date
const now = new Date()
const startRange = new Date(now)
startRange.setDate(startRange.getDate() - 28) // 4 weeks ago
const endRange = new Date(now)
endRange.setDate(endRange.getDate() + 42) // 6 weeks ahead

// Helper to create date within range (percentage 0-1 of total range)
const getDateInRange = (percentage: number): Date => {
  const totalMs = endRange.getTime() - startRange.getTime()
  return new Date(startRange.getTime() + totalMs * percentage)
}

// Helper to subtract days from a date
const subtractDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

// Helper to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

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
    plannedStart: getDateInRange(0.05),
    plannedEnd: addDays(getDateInRange(0.05), 5),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: subtractDays(getDateInRange(0.05), 8),
    offerAcceptedAt: subtractDays(getDateInRange(0.05), 6),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: addDays(getDateInRange(0.05), 6),
    invoicePaidAt: addDays(getDateInRange(0.05), 12),
    createdAt: subtractDays(getDateInRange(0.05), 8),
    updatedAt: addDays(getDateInRange(0.05), 12),
  },
  {
    name: 'Generator oil change',
    estimatedHours: 4.5,
    estimatedCosts: 650.0,
    plannedStart: getDateInRange(0.15),
    plannedEnd: addDays(getDateInRange(0.15), 4),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: subtractDays(getDateInRange(0.15), 10),
    offerAcceptedAt: subtractDays(getDateInRange(0.15), 9),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: addDays(getDateInRange(0.15), 5),
    createdAt: subtractDays(getDateInRange(0.15), 10),
    updatedAt: addDays(getDateInRange(0.15), 5),
  },
  {
    name: 'Roof leak assessment',
    estimatedHours: 6.0,
    estimatedCosts: 1800.0,
    plannedStart: getDateInRange(0.25),
    plannedEnd: addDays(getDateInRange(0.25), 5),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: subtractDays(getDateInRange(0.25), 7),
    createdAt: subtractDays(getDateInRange(0.25), 7),
    updatedAt: subtractDays(getDateInRange(0.25), 7),
  },
  {
    name: 'Elevator safety check',
    estimatedHours: 10.0,
    estimatedCosts: 2400.0,
    plannedStart: getDateInRange(0.35),
    plannedEnd: addDays(getDateInRange(0.35), 6),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: subtractDays(getDateInRange(0.35), 12),
    offerAcceptedAt: subtractDays(getDateInRange(0.35), 10),
    createdAt: subtractDays(getDateInRange(0.35), 12),
    updatedAt: subtractDays(getDateInRange(0.35), 10),
  },
  {
    name: 'Fire alarm panel recertification',
    estimatedHours: 3.5,
    estimatedCosts: 950.0,
    plannedStart: getDateInRange(0.45),
    plannedEnd: addDays(getDateInRange(0.45), 4),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: subtractDays(getDateInRange(0.45), 9),
    offerAcceptedAt: subtractDays(getDateInRange(0.45), 8),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: addDays(getDateInRange(0.45), 5),
    createdAt: subtractDays(getDateInRange(0.45), 9),
    updatedAt: addDays(getDateInRange(0.45), 5),
  },
  {
    name: 'Sprinkler system flush',
    estimatedHours: 7.0,
    estimatedCosts: 1350.0,
    plannedStart: getDateInRange(0.53),
    plannedEnd: addDays(getDateInRange(0.53), 6),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: subtractDays(getDateInRange(0.53), 8),
    createdAt: subtractDays(getDateInRange(0.53), 8),
    updatedAt: subtractDays(getDateInRange(0.53), 8),
  },
  {
    name: 'Parking gate motor replacement',
    estimatedHours: 12.0,
    estimatedCosts: 3200.0,
    plannedStart: getDateInRange(0.61),
    plannedEnd: addDays(getDateInRange(0.61), 7),
    offerCreatedBy: 'svenja.vogel',
    offerCreatedAt: subtractDays(getDateInRange(0.61), 11),
    offerAcceptedAt: subtractDays(getDateInRange(0.61), 9),
    createdAt: subtractDays(getDateInRange(0.61), 11),
    updatedAt: subtractDays(getDateInRange(0.61), 9),
  },
  {
    name: 'Chiller compressor diagnostics',
    estimatedHours: 5.0,
    estimatedCosts: 2100.0,
    plannedStart: getDateInRange(0.69),
    plannedEnd: addDays(getDateInRange(0.69), 5),
    offerCreatedBy: 'anna.lenz',
    offerCreatedAt: subtractDays(getDateInRange(0.69), 10),
    offerAcceptedAt: subtractDays(getDateInRange(0.69), 9),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: addDays(getDateInRange(0.69), 6),
    invoicePaidAt: addDays(getDateInRange(0.69), 13),
    createdAt: subtractDays(getDateInRange(0.69), 10),
    updatedAt: addDays(getDateInRange(0.69), 13),
  },
  {
    name: 'Boiler maintenance',
    estimatedHours: 9.0,
    estimatedCosts: 1750.0,
    plannedStart: getDateInRange(0.77),
    plannedEnd: addDays(getDateInRange(0.77), 5),
    offerCreatedBy: 'thomas.schmidt',
    offerCreatedAt: subtractDays(getDateInRange(0.77), 8),
    offerAcceptedAt: subtractDays(getDateInRange(0.77), 7),
    createdAt: subtractDays(getDateInRange(0.77), 8),
    updatedAt: subtractDays(getDateInRange(0.77), 7),
  },
  {
    name: 'Emergency lighting test',
    estimatedHours: 4.0,
    estimatedCosts: 800.0,
    plannedStart: getDateInRange(0.85),
    plannedEnd: addDays(getDateInRange(0.85), 3),
    offerCreatedBy: 'julia.hartmann',
    offerCreatedAt: subtractDays(getDateInRange(0.85), 7),
    invoiceCreatedBy: 'finance.bot',
    invoiceCreatedAt: addDays(getDateInRange(0.85), 4),
    createdAt: subtractDays(getDateInRange(0.85), 7),
    updatedAt: addDays(getDateInRange(0.85), 4),
  },
  {
    name: 'Water tank inspection',
    estimatedHours: 6.5,
    estimatedCosts: 1450.0,
    plannedStart: getDateInRange(0.93),
    plannedEnd: addDays(getDateInRange(0.93), 4),
    offerCreatedBy: 'marco.richter',
    offerCreatedAt: subtractDays(getDateInRange(0.93), 9),
    offerAcceptedAt: subtractDays(getDateInRange(0.93), 8),
    createdAt: subtractDays(getDateInRange(0.93), 9),
    updatedAt: subtractDays(getDateInRange(0.93), 8),
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
