import { Container, Heading, Stack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { CaseForm } from '../CaseForm'
import type { CaseFormData } from '../CaseForm'
import { maintenanceCasesCollection } from '@/db/collections'
import { toaster } from '@/components/ui/toaster'

export function CaseNew() {
  const navigate = useNavigate()

  const handleSubmit = (data: CaseFormData) => {
    try {
      const caseId = crypto.randomUUID()
      maintenanceCasesCollection.insert({
        id: caseId,
        name: data.name,
        plannedStart: data.plannedStart,
        plannedEnd: data.plannedEnd,
        estimatedHours: data.estimatedHours,
        estimatedCosts: data.estimatedCosts,
        offerCreatedAt: data.offerCreatedAt,
        offerCreatedBy: null,
        offerAcceptedAt: data.offerAcceptedAt,
        invoiceCreatedAt: data.invoiceCreatedAt,
        invoiceCreatedBy: null,
        invoicePaidAt: data.invoicePaidAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      toaster.create({
        title: 'Wartungsfall erstellt',
        type: 'success',
      })

      navigate({ to: '/hangar/$caseId', params: { caseId } })
    } catch (error) {
      console.error('Failed to create case:', error)
      toaster.create({
        description:
          error instanceof Error ? error.message : 'Unbekannter Fehler',
        title: 'Fehler beim Erstellen',
        type: 'error',
      })
    }
  }

  const handleCancel = () => {
    navigate({ to: '/hangar' })
  }

  return (
    <Container maxW="3xl" py={8}>
      <Stack gap={6}>
        <Heading size="xl">Neuer Wartungsfall</Heading>
        <CaseForm
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitLabel="Erstellen"
        />
      </Stack>
    </Container>
  )
}
