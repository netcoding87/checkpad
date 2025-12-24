import { Button, Checkbox, Fieldset, Input, Stack } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import type { CheckboxCheckedChangeDetails } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'

export type CaseFormData = {
  estimatedCosts: number | null
  estimatedHours: number | null
  invoiceCreatedAt: Date | null
  invoicePaidAt: Date | null
  name: string
  offerAcceptedAt: Date | null
  offerCreatedAt: Date | null
  plannedEnd: Date
  plannedStart: Date
}

type CaseFormProps = {
  defaultValues?: Partial<CaseFormData>
  onCancel: () => void
  onSubmit: (data: CaseFormData) => void | Promise<void>
  submitLabel?: string
}

export function CaseForm({
  defaultValues = {},
  onCancel,
  onSubmit,
  submitLabel = 'Speichern',
}: CaseFormProps) {
  const form = useForm({
    defaultValues: {
      estimatedCosts: null,
      estimatedHours: null,
      invoiceCreatedAt: null,
      invoicePaidAt: null,
      name: '',
      offerAcceptedAt: null,
      offerCreatedAt: null,
      plannedEnd: new Date(),
      plannedStart: new Date(),
      ...defaultValues,
    } as CaseFormData,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

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
          <Fieldset.Legend>Grunddaten</Fieldset.Legend>
          <Fieldset.Content>
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? 'Name ist erforderlich' : undefined,
              }}
            >
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="Name"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="z.B. HVAC Inspektion"
                    value={field.state.value}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="plannedStart">
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="Geplanter Start"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(new Date(e.target.value))
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

            <form.Field name="plannedEnd">
              {(field) => (
                <Field
                  errorText={field.state.meta.errors.join(', ')}
                  invalid={field.state.meta.errors.length > 0}
                  label="Geplantes Ende"
                  required
                >
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(new Date(e.target.value))
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

            <form.Field name="estimatedHours">
              {(field) => (
                <Field label="Geschätzte Stunden">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="z.B. 8.5"
                    step="0.5"
                    type="number"
                    value={field.state.value ?? ''}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name="estimatedCosts">
              {(field) => (
                <Field label="Geschätzte Kosten (EUR)">
                  <Input
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value ? Number(e.target.value) : null,
                      )
                    }
                    placeholder="z.B. 1200.00"
                    step="0.01"
                    type="number"
                    value={field.state.value ?? ''}
                  />
                </Field>
              )}
            </form.Field>
          </Fieldset.Content>
        </Fieldset.Root>

        <Fieldset.Root>
          <Fieldset.Legend>Workflow</Fieldset.Legend>
          <Fieldset.Content>
            <form.Field name="offerCreatedAt">
              {(field) => (
                <Checkbox.Root
                  checked={field.state.value !== null}
                  onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                    field.handleChange(
                      details.checked === true ? new Date() : null,
                    )
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Angebot erstellt</Checkbox.Label>
                </Checkbox.Root>
              )}
            </form.Field>

            <form.Field name="offerAcceptedAt">
              {(field) => (
                <Checkbox.Root
                  checked={field.state.value !== null}
                  onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                    field.handleChange(
                      details.checked === true ? new Date() : null,
                    )
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Angebot akzeptiert</Checkbox.Label>
                </Checkbox.Root>
              )}
            </form.Field>

            <form.Field name="invoiceCreatedAt">
              {(field) => (
                <Checkbox.Root
                  checked={field.state.value !== null}
                  onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                    field.handleChange(
                      details.checked === true ? new Date() : null,
                    )
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Rechnung erstellt</Checkbox.Label>
                </Checkbox.Root>
              )}
            </form.Field>

            <form.Field name="invoicePaidAt">
              {(field) => (
                <Checkbox.Root
                  checked={field.state.value !== null}
                  onCheckedChange={(details: CheckboxCheckedChangeDetails) =>
                    field.handleChange(
                      details.checked === true ? new Date() : null,
                    )
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>Rechnung bezahlt</Checkbox.Label>
                </Checkbox.Root>
              )}
            </form.Field>
          </Fieldset.Content>
        </Fieldset.Root>

        <Stack direction="row" gap={3} justify="flex-end">
          <Button onClick={onCancel} type="button" variant="ghost">
            Abbrechen
          </Button>
          <Button colorPalette="blue" type="submit">
            {submitLabel}
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
