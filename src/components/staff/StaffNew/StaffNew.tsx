import { Container, Heading, Stack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { StaffForm } from '../StaffForm'
import type { StaffFormData } from '../StaffForm'
import { staffCollection } from '@/db/collections'
import { toaster } from '@/components/ui/toaster'

export function StaffNew() {
  const navigate = useNavigate()

  const handleSubmit = async (data: StaffFormData) => {
    try {
      const staffId = crypto.randomUUID()
      await staffCollection.insert({
        id: staffId,
        birthday: data.birthday,
        createdAt: new Date(),
        email: data.email,
        firstName: data.firstName,
        hourlyRate: data.hourlyRate,
        isActive: data.isActive,
        lastName: data.lastName,
        phone: data.phone,
        sickDaysUsed: data.sickDaysUsed,
        updatedAt: new Date(),
        vacationDaysTotal: data.vacationDaysTotal,
        vacationDaysUsed: data.vacationDaysUsed,
      })

      toaster.create({
        title: 'Mitarbeiter erstellt',
        type: 'success',
      })

      navigate({ to: '/staff' })
    } catch (error) {
      console.error('Failed to create staff member:', error)
      toaster.create({
        description:
          error instanceof Error ? error.message : 'Unbekannter Fehler',
        title: 'Fehler beim Erstellen',
        type: 'error',
      })
    }
  }

  const handleCancel = () => {
    navigate({ to: '/staff' })
  }

  return (
    <Container maxW="2xl" py={10}>
      <Stack gap={8}>
        <Heading>Neuer Mitarbeiter</Heading>
        <StaffForm
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Erstellen"
        />
      </Stack>
    </Container>
  )
}
