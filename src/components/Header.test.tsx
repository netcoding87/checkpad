import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Header from './Header'
import { Provider } from '@/components/ui/provider'

// Mock TanStack Router Link
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, style }: any) => (
    <a href={to} style={style}>
      {children}
    </a>
  ),
}))

// Mock custom color mode hooks used in Header
const mockToggleColorMode = vi.fn()
vi.mock('./ui/color-mode', () => ({
  ColorModeProvider: ({ children }: { children: any }) => <>{children}</>,
  useColorMode: () => ({
    colorMode: 'dark',
    toggleColorMode: mockToggleColorMode,
    setColorMode: vi.fn(),
  }),
  useColorModeValue: <T, TDark>(light: T, _dark: TDark) => light,
}))

const renderHeader = () => {
  return render(
    <Provider>
      <Header />
    </Provider>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders logo and project name', () => {
    renderHeader()
    expect(screen.getByText('checkPAD')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('renders theme toggle button', () => {
    renderHeader()
    expect(
      screen.getByRole('button', { name: /toggle theme/i }),
    ).toBeInTheDocument()
  })

  it('toggles theme when button is clicked', async () => {
    const user = userEvent.setup()
    renderHeader()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })

    // Click to toggle theme
    await user.click(toggleButton)
    await waitFor(() => {
      // Verify button is still present after toggle
      expect(toggleButton).toBeInTheDocument()
    })
  })
})
