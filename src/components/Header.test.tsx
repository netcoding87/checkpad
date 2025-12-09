import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

// Mock TanStack Router Link
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders logo and project name', () => {
    render(<Header />)
    expect(screen.getByText('checkPAD')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /checkpad/i })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('renders theme toggle button', () => {
    render(<Header />)
    expect(
      screen.getByRole('button', { name: /toggle theme/i }),
    ).toBeInTheDocument()
  })

  it('defaults to dark theme when no preference is saved', async () => {
    render(<Header />)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })

  it('uses saved theme from localStorage', async () => {
    localStorage.setItem('theme', 'light')
    render(<Header />)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  it('toggles theme when button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    // Wait for initial theme to be set
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })

    // Toggle to light
    await user.click(toggleButton)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(localStorage.getItem('theme')).toBe('light')
    })

    // Toggle back to dark
    await user.click(toggleButton)
    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(localStorage.getItem('theme')).toBe('dark')
    })
  })

  it('shows sun icon in dark mode', () => {
    render(<Header />)
    // Sun icon should be visible in dark mode
    const button = screen.getByRole('button', { name: /toggle theme/i })
    expect(button.querySelector('svg')).toBeInTheDocument()
  })
})
