import { createFileRoute } from '@tanstack/react-router'
import { and, eq, inArray } from 'drizzle-orm'
import { db } from '@/db'
import { getTxId } from '@/db/helper'
import { maintenanceCaseStaffTable, maintenanceCasesTable } from '@/db/schema'

// Parse timestamp strings to Date objects
const parseTimestampFields = (
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const timestampFields = [
    'plannedStart',
    'plannedEnd',
    'offerCreatedAt',
    'offerAcceptedAt',
    'invoiceCreatedAt',
    'invoicePaidAt',
    'createdAt',
    'updatedAt',
  ]

  const parsed = { ...data }
  for (const field of timestampFields) {
    if (field in parsed && typeof parsed[field] === 'string') {
      parsed[field] = new Date(parsed[field])
    }
  }
  return parsed
}

const handlePost = async ({ request }: { request: Request }) => {
  const body = await request.json()
  const { staffIds = [], ...caseData } = body
  const parsedBody = parseTimestampFields(caseData)

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    const [newCase] = await tx
      .insert(maintenanceCasesTable)
      .values(parsedBody as any)
      .returning({ id: maintenanceCasesTable.id })

    // Insert staff assignments if provided
    if (staffIds && staffIds.length > 0) {
      await tx.insert(maintenanceCaseStaffTable).values(
        staffIds.map((staffId: string) => ({
          caseId: newCase.id,
          staffId,
          assignedBy: 'system', // TODO: get from session/auth context
        })),
      )
    }

    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  })
}

const handlePut = async ({ request }: { request: Request }) => {
  const body = await request.json()
  const { id, staffIds = [], ...updates } = body
  const parsedUpdates = parseTimestampFields(updates)

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)

    // Update case data
    await tx
      .update(maintenanceCasesTable)
      .set({ ...parsedUpdates, updatedAt: new Date() })
      .where(eq(maintenanceCasesTable.id, id))

    // Get current staff assignments
    const currentAssignments = await tx
      .select({ staffId: maintenanceCaseStaffTable.staffId })
      .from(maintenanceCaseStaffTable)
      .where(eq(maintenanceCaseStaffTable.caseId, id))

    const currentStaffIds = currentAssignments.map((a) => a.staffId)
    const newStaffIds = staffIds || []

    // Find staff to remove and add
    const staffToRemove = currentStaffIds.filter(
      (staffId) => !newStaffIds.includes(staffId),
    )
    const staffToAdd = newStaffIds.filter(
      (staffId: string) => !currentStaffIds.includes(staffId),
    )

    // Remove unselected staff
    if (staffToRemove.length > 0) {
      await tx
        .delete(maintenanceCaseStaffTable)
        .where(
          and(
            eq(maintenanceCaseStaffTable.caseId, id),
            inArray(maintenanceCaseStaffTable.staffId, staffToRemove),
          ),
        )
    }

    // Add new staff
    if (staffToAdd.length > 0) {
      await tx.insert(maintenanceCaseStaffTable).values(
        staffToAdd.map((staffId: string) => ({
          caseId: id,
          staffId,
          assignedBy: 'system', // TODO: get from session/auth context
        })),
      )
    }

    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

const handleDelete = async ({ request }: { request: Request }) => {
  const body = await request.json()
  const { id } = body

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    await tx
      .delete(maintenanceCasesTable)
      .where(eq(maintenanceCasesTable.id, id))
    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/maintenance-cases')({
  server: {
    handlers: {
      DELETE: handleDelete,
      POST: handlePost,
      PUT: handlePut,
    },
  },
})
