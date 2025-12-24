import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { getTxId } from '@/db/helper'
import { maintenanceCasesTable } from '@/db/schema'

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
  const parsedBody = parseTimestampFields(body)

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    await tx.insert(maintenanceCasesTable).values(parsedBody as any)
    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  })
}

const handlePut = async ({ request }: { request: Request }) => {
  const body = await request.json()
  const { id, ...updates } = body
  const parsedUpdates = parseTimestampFields(updates)

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    await tx
      .update(maintenanceCasesTable)
      .set({ ...parsedUpdates, updatedAt: new Date() })
      .where(eq(maintenanceCasesTable.id, id))
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
