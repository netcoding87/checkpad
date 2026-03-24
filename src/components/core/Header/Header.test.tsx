import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Header } from './Header'
import type { ReactNode } from 'react'
import { render, screen } from '@/test/utils'

const { fetchMock, signOutMock, useSessionMock } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  signOutMock: vi.fn(),
  useSessionMock: vi.fn(),
}))

vi.stubGlobal('fetch', fetchMock)

vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: signOutMock,
    useSession: useSessionMock,
  },
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
  }: {
    children: ReactNode | ((props: { isActive: boolean }) => ReactNode)
    to: string
  }) => (
    <a href={to}>
      {typeof children === 'function'
        ? children({ isActive: false })
        : children}
    </a>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    signOutMock.mockReset()
    useSessionMock.mockReset()
    fetchMock.mockResolvedValue({
      json: () =>
        Promise.resolve({ logoutUrl: 'http://localhost:9090/logout' }),
      ok: true,
    })
  })

  it('is a function component', () => {
    expect(typeof Header).toBe('function')
  })

  it('exports the Header component', () => {
    expect(Header).toBeDefined()
  })

  it('does not show sign in button when no session is available', () => {
    useSessionMock.mockReturnValue({ data: null, isPending: false })

    render(<Header />)

    expect(
      screen.queryByRole('button', { name: 'Sign in' }),
    ).not.toBeInTheDocument()
  })

  it('shows user name and allows sign out when session is available', async () => {
    useSessionMock.mockReturnValue({
      data: {
        user: { id: 'user-1', name: 'Dev Admin' },
      },
      isPending: false,
    })

    render(<Header />)

    expect(screen.getByText('Dev Admin')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Sign out' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)

      const [request] = fetchMock.mock.calls[0] as [Request]

      expect(request).toBeInstanceOf(Request)
      expect(request.method).toBe('POST')
      expect(request.url).toContain('/api/auth/keycloak-logout')
      expect(request.credentials).toBe('include')
      expect(signOutMock).toHaveBeenCalled()
    })
  })
})
