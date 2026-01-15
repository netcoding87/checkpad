import { Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { useLiveQuery } from '@tanstack/react-db'
import { useNavigate } from '@tanstack/react-router'
import { StaffForm } from '../StaffForm'
import type { StaffFormData } from '../StaffForm'
import { staffCollection } from '@/db/collections'
import { toaster } from '@/components/ui/toaster'

type StaffEditProps = {
  staffId: string
}

export function StaffEdit({ staffId }: StaffEditProps) {
  const navigate = useNavigate()
  const { data: staff = [] } = useLiveQuery(staffCollection)
  const staffMember = staff.find((s) => s.id === staffId)

  const handleSubmit = async (data: StaffFormData) => {
    try {
      const currentStaff = staff.find((s) => s.id === staffId)
      if (!currentStaff) {
        throw new Error('Staff member not found')
      }

      await staffCollection.update(staffId, (draft) => {
        draft.firstName = data.firstName
        draft.lastName = data.lastName
        draft.email = data.email
        draft.phone = data.phone
        draft.birthday = data.birthday
        draft.hourlyRate = data.hourlyRate
        draft.vacationDaysTotal = data.vacationDaysTotal
        draft.vacationDaysUsed = data.vacationDaysUsed
        draft.sickDaysUsed = data.sickDaysUsed
        draft.isActive = data.isActive
        draft.updatedAt = new Date()
      })

      toaster.create({
        title: 'Mitarbeiter aktualisiert',
        type: 'success',
      })

      navigate({ to: '/staff' })
    } catch (error) {
      console.error('Failed to update staff member:', error)
      toaster.create({
        description:
          error instanceof Error ? error.message : 'Unbekannter Fehler',
        title: 'Fehler beim Aktualisieren',
        type: 'error',
      })
    }
  }

  const handleDelete = async () => {
    if (
      !confirm('Sind Sie sicher, dass Sie diesen Mitarbeiter löschen möchten?')
    ) {
      return
    }

    try {
      const currentStaff = staff.find((s) => s.id === staffId)
      if (!currentStaff) {
        throw new Error('Staff member not found')
      }

      await staffCollection.delete(staffId)

      toaster.create({
        title: 'Mitarbeiter gelöscht',
        type: 'success',
      })

      navigate({ to: '/staff' })
    } catch (error) {
      console.error('Failed to delete staff member:', error)
      toaster.create({
        description:
          error instanceof Error ? error.message : 'Unbekannter Fehler',
        title: 'Fehler beim Löschen',
        type: 'error',
      })
    }
  }

  const handleCancel = () => {
    navigate({ to: '/staff' })
  }

  if (!staffMember) {
    return (
      <Container maxW="2xl" py={10}>
        <Stack gap={8}>
          <Heading>
            <Skeleton height="32px" rounded="md" width="200px" />
          </Heading>
          <Skeleton height="400px" rounded="md" />
        </Stack>
      </Container>
    )
  }

  const defaultValues: StaffFormData = {
    birthday: staffMember.birthday ?? null,
    email: staffMember.email,
    firstName: staffMember.firstName,
    hourlyRate: staffMember.hourlyRate ?? null,
    isActive: staffMember.isActive ?? true,
    lastName: staffMember.lastName,
    phone: staffMember.phone ?? null,
    sickDaysUsed: staffMember.sickDaysUsed ?? 0,
    vacationDaysTotal: staffMember.vacationDaysTotal ?? 30,
    vacationDaysUsed: staffMember.vacationDaysUsed ?? 0,
  }

  return (
    <Container maxW="2xl" py={10}>
      <Stack gap={8}>
        <Heading>
          {staffMember.firstName} {staffMember.lastName} bearbeiten
        </Heading>
        <StaffForm
          defaultValues={defaultValues}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          submitLabel="Aktualisieren"
        />
      </Stack>
    </Container>
  )
}
