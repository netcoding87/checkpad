import { auth } from '@/lib/auth'

type SessionData = Awaited<ReturnType<typeof auth.api.getSession>>

export const unauthorizedResponse = () =>
  new Response(JSON.stringify({ error: 'Unauthorized' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 401,
  })

export const getSessionFromRequest = async (
  request: Request,
): Promise<SessionData> => {
  return auth.api.getSession({ headers: request.headers })
}

export const requireApiSession = async (
  request: Request,
): Promise<{ session: NonNullable<SessionData> } | Response> => {
  const session = await getSessionFromRequest(request)

  if (!session) {
    return unauthorizedResponse()
  }

  return { session }
}
