import { useLiveQuery } from '@tanstack/react-db'
import { describe, expect, it, vi } from 'vitest'
import { StaffTable } from './StaffTable'
import type { Mock } from 'vitest'
import type { Staff } from '@/db/collections'
import { render, screen, waitFor } from '@/test/utils'

vi.mock('@tanstack/react-db', () => ({
  useLiveQuery: vi.fn(),
}))

vi.mock('@/db/collections', () => ({
  staffCollection: 'staffCollection',
}))

const isoNow = () => new Date().toISOString()

const baseStaffMember: Staff = {
  id: 'base-staff-id',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+49-30-1234567',
  birthday: new Date('1990-01-15').toISOString() as any,
  hourlyRate: 85.0,
  vacationDaysTotal: 30,
  vacationDaysUsed: 5,
  sickDaysUsed: 1,
  isActive: true,
  createdAt: isoNow() as any,
  updatedAt: isoNow() as any,
}

const buildStaffMember = (overrides: Partial<Staff>): Staff => ({
  ...baseStaffMember,
  ...overrides,
  id: overrides.id ?? baseStaffMember.id,
  firstName: overrides.firstName ?? baseStaffMember.firstName,
  lastName: overrides.lastName ?? baseStaffMember.lastName,
  email: overrides.email ?? baseStaffMember.email,
})

describe.skip('StaffTable', () => {
  const mockUseLiveQuery = useLiveQuery as unknown as Mock

  beforeEach(() => {
    mockUseLiveQuery.mockReturnValue({ data: [], isLoading: false })
  })

  it('renders table heading', () => {
    render(<StaffTable />)
    expect(screen.getByRole('heading', { name: /staff/i })).toBeInTheDocument()
  })

  it('displays total count of staff members', () => {
    const staff = [
      buildStaffMember({ id: '1', firstName: 'John' }),
      buildStaffMember({ id: '2', firstName: 'Jane' }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('2 total')).toBeInTheDocument()
  })

  it('renders table headers', () => {
    render(<StaffTable />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Phone')).toBeInTheDocument()
    expect(screen.getByText('Hourly Rate')).toBeInTheDocument()
    expect(screen.getByText('Vacation Days')).toBeInTheDocument()
    expect(screen.getByText('Sick Days')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('displays staff members when data is loaded', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        hourlyRate: 85.5,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john.doe@company.com')).toBeInTheDocument()
  })

  it('formats hourly rate correctly', async () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        hourlyRate: 85.0,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    const rateRegex = /85,00\s?€/
    await waitFor(() => {
      expect(screen.getByText(rateRegex)).toBeInTheDocument()
    })
  })

  it('displays vacation days correctly', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        vacationDaysTotal: 30,
        vacationDaysUsed: 10,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('10 / 30')).toBeInTheDocument()
  })

  it('displays sick days', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        sickDaysUsed: 2,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('displays "Active" status for active staff', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        isActive: true,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('displays "Inactive" status for inactive staff', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        isActive: false,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getByText('Inactive')).toBeInTheDocument()
  })

  it('displays "-" for null phone numbers', () => {
    const staff = [
      buildStaffMember({
        id: '1',
        firstName: 'John',
        phone: null as any,
      }),
    ]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    const dashes = screen.getAllByText('-')
    expect(dashes.length).toBeGreaterThan(0)
  })

  it('has action buttons for edit and delete', () => {
    const staff = [buildStaffMember({ id: '1' })]

    mockUseLiveQuery.mockReturnValue({ data: staff, isLoading: false })

    render(<StaffTable />)
    expect(screen.getAllByRole('button', { name: /edit/i })).toBeDefined()
    expect(screen.getAllByRole('button', { name: /delete/i })).toBeDefined()
  })
})
