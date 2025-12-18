import { NotFoundPage } from './NotFoundPage'
import { render, screen } from '@/test/utils'

describe('NotFoundPage', () => {
  it('renders 404 message', () => {
    render(<NotFoundPage />)
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument()
  })
})
