import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'
import { render, screen } from '@/test/utils'

const { signInOAuth2Mock } = vi.hoisted(() => ({
  signInOAuth2Mock: vi.fn(),
}))

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      oauth2: signInOAuth2Mock,
    },
  },
}))

describe('LoginPage', () => {
  beforeEach(() => {
    signInOAuth2Mock.mockReset()
    window.history.replaceState({}, '', '/login')
  })

  it('starts keycloak oauth sign in with default redirect', async () => {
    render(<LoginPage />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Keycloak' }),
    )

    expect(signInOAuth2Mock).toHaveBeenCalledWith({
      callbackURL: '/',
      providerId: 'keycloak',
    })
  })

  it('uses redirect query parameter as callback URL', async () => {
    window.history.replaceState({}, '', '/login?redirect=%2Fhangar')
    render(<LoginPage />)

    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with Keycloak' }),
    )

    expect(signInOAuth2Mock).toHaveBeenCalledWith({
      callbackURL: '/hangar',
      providerId: 'keycloak',
    })
  })
})
