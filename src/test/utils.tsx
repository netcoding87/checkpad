import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from '@/components/ui/provider'

/**
 * Custom render function that wraps components with necessary providers
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <Provider>{children}</Provider>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { renderWithProviders as render }
