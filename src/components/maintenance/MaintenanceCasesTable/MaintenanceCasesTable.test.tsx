import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { MaintenanceCasesTable } from './MaintenanceCasesTable'
import type { MaintenanceCaseApi } from '@/test/mocks/handlers'
import type { DefaultBodyType, PathParams } from 'msw'
import { server } from '@/test/mocks/server'
import { render, screen, waitFor } from '@/test/utils'

const isoNow = () => new Date().toISOString()

const baseCase: MaintenanceCaseApi = {
  id: 'base-case-id',
  name: 'Maintenance Case',
  estimatedHours: null,
  estimatedCosts: null,
  plannedStart: null,
  plannedEnd: null,
  offerCreatedBy: null,
  offerCreatedAt: null,
  offerAcceptedAt: null,
  invoiceCreatedBy: null,
  invoiceCreatedAt: null,
  invoicePaidAt: null,
  createdAt: isoNow(),
  updatedAt: isoNow(),
}

const buildCase = (
  overrides: Partial<MaintenanceCaseApi>,
): MaintenanceCaseApi => ({
  ...baseCase,
  ...overrides,
  id: overrides.id ?? baseCase.id,
  name: overrides.name ?? baseCase.name,
  createdAt: overrides.createdAt ?? isoNow(),
  updatedAt: overrides.updatedAt ?? isoNow(),
})

const mockCases = (payload: Array<MaintenanceCaseApi>) =>
  server.use(
    http.get<never, never, Array<MaintenanceCaseApi>>(
      'http://localhost:5173/api/maintenance-cases',
      () => HttpResponse.json(payload),
    ),
  )

describe.skip('MaintenanceCasesTable', () => {
  it('renders table heading', async () => {
    render(<MaintenanceCasesTable />)
    expect(
      await screen.findByRole('heading', { name: /maintenance cases/i }),
    ).toBeInTheDocument()
  })

  it('displays total count of maintenance cases', async () => {
    mockCases([
      buildCase({ id: '1', name: 'Case 1' }),
      buildCase({ id: '2', name: 'Case 2' }),
    ])

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('2 total')).toBeInTheDocument()
  })

  it('renders table headers', async () => {
    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Estimated Hours')).toBeInTheDocument()
    expect(screen.getByText('Estimated Costs')).toBeInTheDocument()
    expect(screen.getByText('Planned Start')).toBeInTheDocument()
    expect(screen.getByText('Planned End')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('displays maintenance cases when data is loaded', async () => {
    mockCases([
      buildCase({
        id: '1',
        name: 'Test Case 1',
        estimatedHours: 10.5,
        estimatedCosts: 1500.0,
        plannedStart: new Date('2025-01-15').toISOString(),
        plannedEnd: new Date('2025-01-20').toISOString(),
        offerCreatedBy: 'John',
        offerCreatedAt: new Date('2025-01-10').toISOString(),
      }),
    ])

    render(<MaintenanceCasesTable />)
    await waitFor(() => {
      expect(screen.getByText('Test Case 1')).toBeInTheDocument()
    })
    expect(screen.getByText('10,50')).toBeInTheDocument()
    // de-DE currency formatting typically yields a non-breaking space before the symbol
    const costRegex = /1\.500,00\s?€/
    expect(screen.getByText(costRegex)).toBeInTheDocument()
  })

  it('displays "Draft" status for cases without offer', async () => {
    mockCases([buildCase({ id: '1', name: 'Draft Case' })])

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Draft')).toBeInTheDocument()
  })

  it('displays "Offered" status when offer is created', async () => {
    mockCases([
      buildCase({
        id: '1',
        name: 'Offered Case',
        offerCreatedBy: 'John',
        offerCreatedAt: new Date('2025-01-10').toISOString(),
      }),
    ])

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Offered')).toBeInTheDocument()
  })

  it('displays "Accepted" status when offer is accepted', async () => {
    mockCases([
      buildCase({
        id: '1',
        name: 'Accepted Case',
        offerCreatedBy: 'John',
        offerCreatedAt: new Date('2025-01-10').toISOString(),
        offerAcceptedAt: new Date('2025-01-12').toISOString(),
      }),
    ])

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Accepted')).toBeInTheDocument()
  })

  it.only('displays "Invoiced" status when invoice is created', async () => {
    const mockedCase = buildCase({
      id: '1',
      name: 'Invoiced Case',
      offerCreatedBy: 'John',
      offerCreatedAt: new Date('2025-01-10').toISOString(),
      offerAcceptedAt: new Date('2025-01-12').toISOString(),
      invoiceCreatedBy: 'John',
      invoiceCreatedAt: new Date('2025-01-20').toISOString(),
    })

    server.use(
      http.get<PathParams, DefaultBodyType, Array<MaintenanceCaseApi>>(
        'http://localhost:5173/api/maintenance-cases',
        () => HttpResponse.json([mockedCase]),
      ),
    )

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Invoiced')).toBeInTheDocument()
  })

  it('displays "Paid" status when invoice is paid', async () => {
    mockCases([
      buildCase({
        id: '1',
        name: 'Paid Case',
        offerCreatedBy: 'John',
        offerCreatedAt: new Date('2025-01-10').toISOString(),
        offerAcceptedAt: new Date('2025-01-12').toISOString(),
        invoiceCreatedBy: 'John',
        invoiceCreatedAt: new Date('2025-01-20').toISOString(),
        invoicePaidAt: new Date('2025-01-25').toISOString(),
      }),
    ])

    render(<MaintenanceCasesTable />)
    expect(await screen.findByText('Paid')).toBeInTheDocument()
  })

  it('displays "-" for null values', async () => {
    mockCases([buildCase({ id: '1', name: 'Case with nulls' })])

    render(<MaintenanceCasesTable />)
    const dashes = await screen.findAllByText('-')
    expect(dashes.length).toBeGreaterThanOrEqual(4)
  })

  it('formats dates correctly', async () => {
    mockCases([
      buildCase({
        id: '1',
        name: 'Case with dates',
        plannedStart: new Date('2025-01-15').toISOString(),
        plannedEnd: new Date('2025-01-20').toISOString(),
      }),
    ])

    render(<MaintenanceCasesTable />)
    const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/
    await waitFor(() => {
      const cells = screen.getAllByRole('cell')
      const hasDates = cells.some((cell) =>
        dateRegex.test(cell.textContent || ''),
      )
      expect(hasDates).toBe(true)
    })
  })
})
