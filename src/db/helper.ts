import { sql } from 'drizzle-orm'

export const getTxId = async (
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  tx: Parameters<Parameters<typeof import('@/db').db.transaction>[0]>[0],
) => {
  const result = await tx.execute(
    sql.raw(`SELECT pg_current_xact_id()::xid::text::int as txid`),
  )

  const txid = result.rows[0]?.txid

  if (txid === undefined) {
    throw new Error(`Failed to get transaction ID`)
  }

  return parseInt(txid as string, 10)
}
