import {
  Button,
  ButtonGroup,
  Checkbox,
  Fieldset,
  IconButton,
  Input,
  Menu,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useLiveQuery } from '@tanstack/react-db'
import { useForm } from '@tanstack/react-form'
import { ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import type { CheckboxCheckedChangeDetails } from '@chakra-ui/react'
import type { SelectOption } from '@/components/ui/select'
import {
  maintenanceCaseStaffCollection,
  staffCollection,
} from '@/db/collections'
import Select from '@/components/ui/select'
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
  staffIds: Array<string>
}

type CaseFormProps = {
  defaultValues?: Partial<CaseFormData>
  onCancel: () => void
  onDelete?: () => void | Promise<void>
  onSaveAndExit?: () => void | Promise<void>
  onSubmit: (data: CaseFormData) => void | Promise<void>
  submitLabel?: string
}

export function CaseForm({
  defaultValues = {},
  onCancel,
  onDelete,
  onSaveAndExit,
  onSubmit,
  submitLabel = 'Speichern',
}: CaseFormProps) {
  // Load staff and assignments
  const { data: allStaff = [] } = useLiveQuery(staffCollection)
  const { data: assignments = [] } = useLiveQuery(
    maintenanceCaseStaffCollection,
  )

  // Filter to only active staff
  const activeStaff = useMemo(
    () => allStaff.filter((s) => s.isActive),
    [allStaff],
  )

  // Calculate workload for each staff member
  const staffWorkload = useMemo(() => {
    const workload: Record<string, number> = {}
    for (const staff of activeStaff) {
      workload[staff.id] = assignments.filter(
        (a) => a.staffId === staff.id,
      ).length
    }
    return workload
  }, [activeStaff, assignments])

  // Prepare staff options for Select component
  const staffOptions: Array<
    SelectOption<{
      email: string
      workload: number
    }>
  > = useMemo(
    () =>
      activeStaff.map((staff) => ({
        data: {
          email: staff.email,
          workload: staffWorkload[staff.id] || 0,
        },
        label: `${staff.firstName} ${staff.lastName}`,
        value: staff.id,
      })),
    [activeStaff, staffWorkload],
  )

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
      staffIds: [],
      ...defaultValues,
    } as CaseFormData,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      form.reset(value)
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
          <Fieldset.Legend>Team Zuweisung</Fieldset.Legend>
          <Fieldset.Content>
            <form.Field name="staffIds">
              {(field) => (
                <Field label="Mitarbeiter">
                  <Select
                    isClearable
                    isMultiple
                    onChange={(values) => field.handleChange(values)}
                    options={staffOptions}
                    placeholder="Mitarbeiter auswählen"
                    renderItem={(item, opts) => (
                      <Stack direction="column" gap={1}>
                        <Text>{item.label}</Text>
                        <Text
                          color={opts?.selected ? 'white' : 'gray.500'}
                          fontSize="sm"
                        >
                          {item.data?.email}
                        </Text>
                      </Stack>
                    )}
                    searchable
                    value={field.state.value}
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

        <Stack direction="row" gap={3} justify="space-between">
          <Stack direction="row" gap={3}>
            {onDelete && (
              <Button
                colorPalette="red"
                onClick={async () => {
                  if (
                    confirm(
                      'Sind Sie sicher, dass Sie diesen Wartungsfall löschen möchten?',
                    )
                  ) {
                    await onDelete()
                  }
                }}
                type="button"
                variant="ghost"
              >
                Löschen
              </Button>
            )}
          </Stack>
          <Stack direction="row" gap={3}>
            <Button onClick={handleClose} type="button" variant="ghost">
              Schließen
            </Button>
            <ButtonGroup colorPalette="blue" attached>
              <Button
                borderBottomRightRadius={0}
                borderTopRightRadius={0}
                type="submit"
              >
                {submitLabel}
              </Button>
              {onSaveAndExit && (
                <Menu.Root positioning={{ placement: 'bottom-end' }}>
                  <Menu.Trigger asChild>
                    <IconButton
                      aria-label="Mehr Optionen"
                      borderBottomLeftRadius={0}
                      borderTopLeftRadius={0}
                    >
                      <ChevronDown />
                    </IconButton>
                  </Menu.Trigger>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="save-exit"
                        onClick={async () => {
                          await form.handleSubmit()
                          await onSaveAndExit()
                        }}
                      >
                        {submitLabel} und schließen
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              )}
            </ButtonGroup>
          </Stack>
        </Stack>
      </Stack>
    </form>
  )
}
