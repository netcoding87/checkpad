import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Header } from './Header'
import type { ReactNode } from 'react'
import { render, screen } from '@/test/utils'

const { signOutMock, useSessionMock } = vi.hoisted(() => ({
  signOutMock: vi.fn(),
  useSessionMock: vi.fn(),
}))

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
    signOutMock.mockReset()
    useSessionMock.mockReset()
  })

  it('is a function component', () => {
    expect(typeof Header).toBe('function')
  })

  it('exports the Header component', () => {
    expect(Header).toBeDefined()
  })

  it('shows login link when no session is available', () => {
    useSessionMock.mockReturnValue({ data: null, isPending: false })

    render(<Header />)

    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
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

    expect(signOutMock).toHaveBeenCalled()
  })
})
