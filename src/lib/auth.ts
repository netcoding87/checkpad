import { db } from '@/db'
import * as schema from '@/db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { genericOAuth, keycloak } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

const authBaseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
const keycloakIssuer =
  process.env.KEYCLOAK_ISSUER || 'http://localhost:8080/realms/checkpad'
const keycloakClientId = process.env.KEYCLOAK_CLIENT_ID || 'checkpad-web'
const keycloakClientSecret = process.env.KEYCLOAK_CLIENT_SECRET || 'dev-secret'
const authSecret =
  process.env.BETTER_AUTH_SECRET || 'dev-only-better-auth-secret-change-me'

export const auth = betterAuth({
  baseURL: authBaseUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...schema,
      account: schema.accounts,
      session: schema.sessions,
      user: schema.users,
      verification: schema.verifications,
    },
    usePlural: true,
  }),
  plugins: [
    genericOAuth({
      config: [
        keycloak({
          clientId: keycloakClientId,
          clientSecret: keycloakClientSecret,
          issuer: keycloakIssuer,
          providerId: 'keycloak',
          scopes: ['openid', 'profile', 'email'],
        }),
      ],
    }),
    tanstackStartCookies(),
  ],
  secret: authSecret,
  trustedOrigins: [authBaseUrl],
})
