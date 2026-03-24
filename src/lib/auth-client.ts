import { genericOAuthClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL || globalThis.location?.origin,
  plugins: [genericOAuthClient()],
})
