import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { getTxId } from '@/db/helper'
import { maintenanceCaseStaffTable } from '@/db/schema'

const handlePost = async ({ request }: { request: Request }) => {
  const body = await request.json()

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    await tx.insert(maintenanceCaseStaffTable).values(body)
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

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    const currentTxid = await getTxId(tx)
    await tx
      .update(maintenanceCaseStaffTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(maintenanceCaseStaffTable.id, id))
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
      .delete(maintenanceCaseStaffTable)
      .where(eq(maintenanceCaseStaffTable.id, id))
    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/maintenance-case-staff')({
  server: {
    handlers: {
      DELETE: handleDelete,
      POST: handlePost,
      PUT: handlePut,
    },
  },
})
