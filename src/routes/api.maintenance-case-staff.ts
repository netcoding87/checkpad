import { createFileRoute } from '@tanstack/react-router'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { getTxId } from '@/db/helper'
import { maintenanceCaseStaffTable } from '@/db/schema'
import { requireApiSession } from '@/lib/auth-session'

const handlePost = async ({ request }: { request: Request }) => {
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const actorId = authResult.session.user.id
  const body = await request.json()

  const txid = await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user', ${actorId}, true)`,
    )

    const currentTxid = await getTxId(tx)
    await tx
      .insert(maintenanceCaseStaffTable)
      .values({ ...body, assignedBy: body.assignedBy ?? actorId })
    return currentTxid
  })

  return new Response(JSON.stringify({ txid }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201,
  })
}

const handlePut = async ({ request }: { request: Request }) => {
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const actorId = authResult.session.user.id
  const body = await request.json()
  const { id, ...updates } = body

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user', ${actorId}, true)`,
    )

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
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const actorId = authResult.session.user.id
  const body = await request.json()
  const { id } = body

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID is required' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const txid = await db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_user', ${actorId}, true)`,
    )

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
