import { describe, expect, it, vi } from 'vitest'
import { StaffForm } from './StaffForm'
import { render, screen, waitFor } from '@/test/utils'

describe.skip('StaffForm', () => {
  it('renders form fields', () => {
    render(<StaffForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('First Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()
    expect(screen.getByLabelText('Birthday')).toBeInTheDocument()
    expect(screen.getByLabelText('Hourly Rate')).toBeInTheDocument()
    expect(screen.getByLabelText('Vacation Days Total')).toBeInTheDocument()
    expect(screen.getByLabelText('Vacation Days Used')).toBeInTheDocument()
    expect(screen.getByLabelText('Sick Days Used')).toBeInTheDocument()
  })

  it('requires first name', async () => {
    const mockSubmit = vi.fn()
    render(<StaffForm onSubmit={mockSubmit} onCancel={vi.fn()} />)

    const submitButton = screen.getByRole('button', { name: /save/i })
    submitButton.click()

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
    })
  })

  it('requires last name', async () => {
    const mockSubmit = vi.fn()
    render(<StaffForm onSubmit={mockSubmit} onCancel={vi.fn()} />)

    const submitButton = screen.getByRole('button', { name: /save/i })
    submitButton.click()

    await waitFor(() => {
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
    })
  })

  it('requires valid email', async () => {
    const mockSubmit = vi.fn()
    render(<StaffForm onSubmit={mockSubmit} onCancel={vi.fn()} />)

    const emailInput = screen.getByLabelText('Email')
    emailInput.click()
    emailInput.focus()
    screen.getByDisplayValue('').type('invalid-email')
    screen.getByDisplayValue('invalid-email').blur()

    const submitButton = screen.getByRole('button', { name: /save/i })
    submitButton.click()

    await waitFor(() => {
      expect(screen.getByText('Valid email is required')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockSubmit = vi.fn()
    render(<StaffForm onSubmit={mockSubmit} onCancel={vi.fn()} />)

    screen.getByLabelText('First Name').value = 'John'
    screen.getByLabelText('Last Name').value = 'Doe'
    screen.getByLabelText('Email').value = 'john@example.com'
    screen.getByLabelText('Hourly Rate').value = '85.00'

    const submitButton = screen.getByRole('button', { name: /save/i })
    submitButton.click()

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })

  it('shows cancel button', () => {
    render(<StaffForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('shows delete button when onDelete provided', () => {
    render(
      <StaffForm onSubmit={vi.fn()} onCancel={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('populates form with default values', () => {
    const defaultValues = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      hourlyRate: 95.0,
    }

    render(
      <StaffForm
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        defaultValues={defaultValues}
      />,
    )

    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
  })

  it('shows unsaved changes confirmation on cancel', () => {
    const mockCancel = vi.fn()
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    render(<StaffForm onSubmit={vi.fn()} onCancel={mockCancel} />)

    screen.getByLabelText('First Name').value = 'John'

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    cancelButton.click()

    expect(confirmSpy).toHaveBeenCalled()
    expect(mockCancel).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })
})
