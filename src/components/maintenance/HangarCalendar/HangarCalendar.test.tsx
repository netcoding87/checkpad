import { useLiveQuery } from '@tanstack/react-db'
import { vi } from 'vitest'
import { HangarCalendar } from './HangarCalendar'
import type { Mock } from 'vitest'
import { render, screen } from '@/test/utils'

vi.mock('@tanstack/react-db', () => ({
  useLiveQuery: vi.fn(),
}))

vi.mock('@/db/collections', () => ({
  maintenanceCasesCollection: 'maintenanceCasesCollection',
}))

describe.skip('HangarCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-06-15T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders maintenance cases from live query', () => {
    ;(useLiveQuery as unknown as Mock).mockReturnValue({
      data: [
        {
          id: 'case-1',
          name: 'Alpha',
          plannedStart: '2025-01-10T00:00:00.000Z',
          plannedEnd: '2025-01-15T00:00:00.000Z',
        },
      ],
      isLoading: false,
    })

    render(<HangarCalendar />)

    expect(screen.getByText('Hangar')).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Previous year' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next year' }),
    ).toBeInTheDocument()
  })

  it('shows loading skeletons', () => {
    ;(useLiveQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: true,
    })

    render(<HangarCalendar />)

    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0)
  })
})
