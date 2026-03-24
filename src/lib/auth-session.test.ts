import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getSessionFromRequest, requireApiSession } from '@/lib/auth-session'

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}))

describe('auth session helpers', () => {
  beforeEach(() => {
    getSessionMock.mockReset()
  })

  it('returns session from auth api when request has a valid session', async () => {
    const session = {
      session: { id: 'session-1' },
      user: { id: 'user-1', name: 'Test User' },
    }

    getSessionMock.mockResolvedValue(session)

    const request = new Request('http://localhost:3000/api/staff', {
      headers: {
        cookie: 'session=abc',
      },
    })

    await expect(getSessionFromRequest(request)).resolves.toEqual(session)
    expect(getSessionMock).toHaveBeenCalledWith({ headers: request.headers })
  })

  it('returns 401 response when session is missing', async () => {
    getSessionMock.mockResolvedValue(null)

    const request = new Request('http://localhost:3000/api/staff')
    const result = await requireApiSession(request)

    expect(result).toBeInstanceOf(Response)
    expect((result as Response).status).toBe(401)
    await expect((result as Response).json()).resolves.toEqual({
      error: 'Unauthorized',
    })
  })

  it('returns session object when authenticated', async () => {
    const session = {
      session: { id: 'session-2' },
      user: { id: 'user-2', email: 'user@example.com' },
    }

    getSessionMock.mockResolvedValue(session)

    const request = new Request('http://localhost:3000/api/staff')
    const result = await requireApiSession(request)

    expect(result).toEqual({ session })
  })
})
