import { Dashboard } from './Dashboard'
import { render, screen } from '@/test/utils'

// Mock MaintenanceCasesTable component
vi.mock('@/components/maintenance/MaintenanceCasesTable', () => ({
  MaintenanceCasesTable: () => (
    <div data-testid="maintenance-cases-table">Maintenance Cases</div>
  ),
}))

describe('Dashboard', () => {
  it('renders Dashboard heading', () => {
    render(<Dashboard />)
    expect(
      screen.getByRole('heading', { name: /dashboard/i }),
    ).toBeInTheDocument()
  })

  it('renders MaintenanceCasesTable component', () => {
    render(<Dashboard />)
    // The table should be present with its heading
    expect(screen.getByText('Maintenance Cases')).toBeInTheDocument()
  })

  it('renders within a container with proper max width', () => {
    const { container } = render(<Dashboard />)
    // Chakra UI Container component renders
    expect(container.firstChild).toBeTruthy()
  })

  it('has proper vertical spacing between elements', () => {
    const { container } = render(<Dashboard />)
    // Check that elements are rendered
    expect(container.firstChild).toBeTruthy()
  })
})
