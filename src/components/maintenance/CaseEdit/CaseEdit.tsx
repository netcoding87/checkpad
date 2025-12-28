import { Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { useLiveQuery } from '@tanstack/react-db'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CaseForm } from '../CaseForm'
import type { CaseFormData } from '../CaseForm'
import { maintenanceCasesCollection } from '@/db/collections'
import { toaster } from '@/components/ui/toaster'

export function CaseEdit() {
  const { caseId } = useParams({ from: '/hangar/$caseId' })
  const navigate = useNavigate()

  const { data: maintenanceCases = [], isLoading } = useLiveQuery(
    maintenanceCasesCollection,
  )

  const maintenanceCase = maintenanceCases.find((c) => c.id === caseId)

  const handleSubmit = (data: CaseFormData) => {
    if (!maintenanceCase) return

    maintenanceCasesCollection.update(maintenanceCase.id, (draft) => {
      draft.name = data.name
      draft.plannedStart = data.plannedStart
      draft.plannedEnd = data.plannedEnd
      draft.estimatedHours = data.estimatedHours
      draft.estimatedCosts = data.estimatedCosts
      draft.offerCreatedAt = data.offerCreatedAt
      draft.offerAcceptedAt = data.offerAcceptedAt
      draft.invoiceCreatedAt = data.invoiceCreatedAt
      draft.invoicePaidAt = data.invoicePaidAt
      draft.updatedAt = new Date()
    })

    toaster.create({
      title: 'Wartungsfall aktualisiert',
      type: 'success',
    })
  }

  const handleCancel = () => {
    navigate({ to: '/hangar' })
  }

  const handleDelete = () => {
    if (!maintenanceCase) return

    maintenanceCasesCollection.delete(maintenanceCase.id)

    toaster.create({
      title: 'Wartungsfall gelöscht',
      type: 'success',
    })

    navigate({ to: '/hangar' })
  }

  const handleSaveAndExit = () => {
    navigate({ to: '/hangar' })
  }

  if (isLoading) {
    return (
      <Container maxW="3xl" py={8}>
        <Stack gap={6}>
          <Skeleton height="40px" width="300px" />
          <Skeleton height="400px" />
        </Stack>
      </Container>
    )
  }

  if (!maintenanceCase) {
    return (
      <Container maxW="3xl" py={8}>
        <Heading size="xl">Wartungsfall nicht gefunden</Heading>
      </Container>
    )
  }

  return (
    <Container maxW="3xl" py={8}>
      <Stack gap={6}>
        <Heading size="xl">Wartungsfall bearbeiten</Heading>
        <CaseForm
          defaultValues={{
            name: maintenanceCase.name,
            plannedStart: new Date(maintenanceCase.plannedStart),
            plannedEnd: new Date(maintenanceCase.plannedEnd),
            estimatedHours: maintenanceCase.estimatedHours,
            estimatedCosts: maintenanceCase.estimatedCosts,
            offerCreatedAt: maintenanceCase.offerCreatedAt
              ? new Date(maintenanceCase.offerCreatedAt)
              : null,
            offerAcceptedAt: maintenanceCase.offerAcceptedAt
              ? new Date(maintenanceCase.offerAcceptedAt)
              : null,
            invoiceCreatedAt: maintenanceCase.invoiceCreatedAt
              ? new Date(maintenanceCase.invoiceCreatedAt)
              : null,
            invoicePaidAt: maintenanceCase.invoicePaidAt
              ? new Date(maintenanceCase.invoicePaidAt)
              : null,
          }}
          onCancel={handleCancel}
          onDelete={handleDelete}
          onSaveAndExit={handleSaveAndExit}
          onSubmit={handleSubmit}
          submitLabel="Speichern"
        />
      </Stack>
    </Container>
  )
}
