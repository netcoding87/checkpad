import { HttpResponse, delay, http } from 'msw'
import type { DefaultBodyType, PathParams } from 'msw'

// API response type for maintenance cases (JSON over the wire)
export type MaintenanceCaseApi = {
  id: string
  name: string
  estimatedHours: number | null
  estimatedCosts: number | null
  plannedStart: string | null
  plannedEnd: string | null
  offerCreatedBy: string | null
  offerCreatedAt: string | null
  offerAcceptedAt: string | null
  invoiceCreatedBy: string | null
  invoiceCreatedAt: string | null
  invoicePaidAt: string | null
  createdAt: string
  updatedAt: string
}

export const handlers = [
  http.all('*', async () => {
    await delay()
  }),
  http.get<PathParams, DefaultBodyType, Array<MaintenanceCaseApi>>(
    '/api/maintenance-cases',
    () => {
      return HttpResponse.json<Array<MaintenanceCaseApi>>([
        {
          id: '1',
          name: 'Test Maintenance Case 1',
          estimatedHours: 10.5,
          estimatedCosts: 1500.0,
          plannedStart: new Date('2025-01-15').toISOString(),
          plannedEnd: new Date('2025-01-20').toISOString(),
          offerCreatedBy: 'John Doe',
          offerCreatedAt: new Date('2025-01-10').toISOString(),
          offerAcceptedAt: null,
          invoiceCreatedBy: null,
          invoiceCreatedAt: null,
          invoicePaidAt: null,
          createdAt: new Date('2025-01-01').toISOString(),
          updatedAt: new Date('2025-01-01').toISOString(),
        },
        {
          id: '2',
          name: 'Test Maintenance Case 2',
          estimatedHours: 25.0,
          estimatedCosts: 3500.0,
          plannedStart: new Date('2025-02-01').toISOString(),
          plannedEnd: new Date('2025-02-10').toISOString(),
          offerCreatedBy: 'Jane Smith',
          offerCreatedAt: new Date('2025-01-20').toISOString(),
          offerAcceptedAt: new Date('2025-01-22').toISOString(),
          invoiceCreatedBy: 'Jane Smith',
          invoiceCreatedAt: new Date('2025-02-11').toISOString(),
          invoicePaidAt: new Date('2025-02-15').toISOString(),
          createdAt: new Date('2025-01-15').toISOString(),
          updatedAt: new Date('2025-02-15').toISOString(),
        },
      ])
    },
  ),
]
