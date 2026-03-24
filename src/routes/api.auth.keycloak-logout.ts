import { createFileRoute } from '@tanstack/react-router'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { accounts } from '@/db/schema'
import { requireApiSession } from '@/lib/auth-session'

const keycloakIssuer =
  process.env.KEYCLOAK_ISSUER || 'http://localhost:9090/realms/checkpad'
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || 'checkpad-web'
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || 'dev-secret'

const buildFrontChannelLogoutUrl = ({
  appOrigin,
  idTokenHint,
}: {
  appOrigin: string
  idTokenHint?: string
}) => {
  const logoutEndpoint = new URL(
    'protocol/openid-connect/logout',
    `${keycloakIssuer.replace(/\/$/, '')}/`,
  )

  logoutEndpoint.searchParams.set('client_id', keycloakClientId)
  logoutEndpoint.searchParams.set('post_logout_redirect_uri', appOrigin)

  if (idTokenHint) {
    logoutEndpoint.searchParams.set('id_token_hint', idTokenHint)
  }

  return logoutEndpoint.toString()
}

const performBackChannelLogout = async (refreshToken: string) => {
  const logoutEndpoint = new URL(
    'protocol/openid-connect/logout',
    `${keycloakIssuer.replace(/\/$/, '')}/`,
  )

  const body = new URLSearchParams({
    client_id: keycloakClientId,
    client_secret: keycloakClientSecret,
    refresh_token: refreshToken,
  })

  await fetch(logoutEndpoint.toString(), {
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  })
}

const handleKeycloakLogout = async ({ request }: { request: Request }) => {
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const appOrigin = new URL(request.url).origin

  const latestKeycloakAccount = await db.query.accounts.findFirst({
    orderBy: [desc(accounts.updatedAt)],
    where: and(
      eq(accounts.userId, authResult.session.user.id),
      eq(accounts.providerId, 'keycloak'),
    ),
  })

  if (latestKeycloakAccount?.refreshToken) {
    try {
      await performBackChannelLogout(latestKeycloakAccount.refreshToken)
    } catch {
      // Continue even if back-channel logout fails.
    }
  }

  const logoutUrl = buildFrontChannelLogoutUrl({
    appOrigin,
    idTokenHint: latestKeycloakAccount?.idToken ?? undefined,
  })

  return new Response(JSON.stringify({ logoutUrl }), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export const Route = createFileRoute('/api/auth/keycloak-logout')({
  server: {
    handlers: {
      GET: handleKeycloakLogout,
      POST: handleKeycloakLogout,
    },
  },
})
