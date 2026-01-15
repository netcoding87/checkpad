import { Button, ButtonGroup, Fieldset, Input, Stack } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import { Field } from '@/components/ui/field'

export type StaffFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string | null
  birthday: Date | null
  hourlyRate: number | null
  vacationDaysTotal: number
  vacationDaysUsed: number
  sickDaysUsed: number
  isActive: boolean
}

type StaffFormProps = {
  defaultValues?: Partial<StaffFormData>
  onCancel: () => void
  onDelete?: () => void | Promise<void>
  onSubmit: (data: StaffFormData) => void | Promise<void>
  submitLabel?: string
}

export function StaffForm({
  defaultValues = {},
  onCancel,
  onDelete,
  onSubmit,
  submitLabel = 'Speichern',
}: StaffFormProps) {
  const form = useForm({
    defaultValues: {
      birthday: null,
      email: '',
      firstName: '',
      hourlyRate: null,
      isActive: true,
      lastName: '',
      phone: null,
      sickDaysUsed: 0,
      vacationDaysTotal: 30,
      vacationDaysUsed: 0,
      ...defaultValues,
    } as StaffFormData,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  const handleClose = () => {
    if (form.state.isDirty) {
      if (
        confirm(
          'Sie haben ungespeicherte Änderungen. Möchten Sie wirklich schließen?',
        )
      ) {
        onCancel()
      }
    } else {
      onCancel()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <Stack gap={6}>
        <Fieldset.Root>
          <Fieldset.Legend>Persönliche Daten</Fieldset.Legend>
          <Fieldset.Content>
            <form.Field
              name="firstName"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Vorname ist erforderlich' : undefined,
              }}
            >
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="Vorname"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="z.B. John"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="lastName"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Nachname ist erforderlich' : undefined,
              }}
            >
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="Nachname"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="z.B. Doe"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return 'E-Mail ist erforderlich'
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    return 'Gültige E-Mail erforderlich'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="E-Mail"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="z.B. john@example.com"
                    type="email"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <Field label="Telefon">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value ? e.target.value : null)
                    }
                    placeholder="z.B. +49-30-1234567"
                    value={field.state.value ?? ''}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="birthday">
              {(field) => (
                <Field label="Geburtsdatum">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? new Date(e.target.value) : null,
                      )
                    }
                    type="date"
                    value={
                      field.state.value instanceof Date
                        ? field.state.value.toISOString().split('T')[0]
                        : ''
                    }
                  />
                </Field>
              )}
            </form.Field>
          </Fieldset.Content>
        </Fieldset.Root>

        <Fieldset.Root>
          <Fieldset.Legend>Abrechnungsdaten</Fieldset.Legend>
          <Fieldset.Content>
            <form.Field name="hourlyRate">
              {(field) => (
                <Field label="Stundensatz (EUR)">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="z.B. 85.00"
                    step="0.01"
                    type="number"
                    value={field.state.value ?? ''}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="vacationDaysTotal">
              {(field) => (
                <Field label="Urlaubstage insgesamt">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : 0,
                      )
                    }
                    type="number"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="vacationDaysUsed">
              {(field) => (
                <Field label="Urlaubstage verwendet">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : 0,
                      )
                    }
                    type="number"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="sickDaysUsed">
              {(field) => (
                <Field label="Krankheitstage">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : 0,
                      )
                    }
                    type="number"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>
          </Fieldset.Content>
        </Fieldset.Root>

        <ButtonGroup>
          <Button
            disabled={form.state.isSubmitting}
            loadingText="Speichern..."
            onClick={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            type="submit"
            variant="solid"
          >
            {submitLabel}
          </Button>
          <Button onClick={handleClose} variant="outline">
            Abbrechen
          </Button>
          {onDelete && (
            <Button
              colorPalette="red"
              disabled={form.state.isSubmitting}
              onClick={onDelete}
              variant="ghost"
            >
              Löschen
            </Button>
          )}
        </ButtonGroup>
      </Stack>
    </form>
  )
}
