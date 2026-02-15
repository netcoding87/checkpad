import { Container, Heading, Skeleton, Stack } from '@chakra-ui/react'
import { createOptimisticAction, useLiveQuery } from '@tanstack/react-db'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useMemo } from 'react'
import { CaseForm } from '../CaseForm'
import type { CaseFormData } from '../CaseForm'
import {
  maintenanceCaseStaffAssignmentsCollection,
  maintenanceCasesCollection,
} from '@/db/collections'
import { toaster } from '@/components/ui/toaster'

type UpdateCaseWithStaffParams = {
  caseId: string
  currentAssignments: Array<{ id: string; staffId: string }>
  updates: CaseFormData
}

const updateCaseWithStaff = createOptimisticAction<UpdateCaseWithStaffParams>({
  onMutate: ({ caseId, currentAssignments, updates }) => {
    const { staffIds, ...caseUpdates } = updates

    maintenanceCasesCollection.update(caseId, (draft) => {
      draft.name = caseUpdates.name
      draft.plannedStart = caseUpdates.plannedStart
      draft.plannedEnd = caseUpdates.plannedEnd
      draft.estimatedHours = caseUpdates.estimatedHours
      draft.estimatedCosts = caseUpdates.estimatedCosts
      draft.offerCreatedAt = caseUpdates.offerCreatedAt
      draft.offerAcceptedAt = caseUpdates.offerAcceptedAt
      draft.invoiceCreatedAt = caseUpdates.invoiceCreatedAt
      draft.invoicePaidAt = caseUpdates.invoicePaidAt
      draft.updatedAt = new Date()
    })

    const currentStaffIds = currentAssignments.map(
      (assignment) => assignment.staffId,
    )
    const staffToRemove = currentStaffIds.filter(
      (staffId) => !staffIds.includes(staffId),
    )
    const staffToAdd = staffIds.filter(
      (staffId) => !currentStaffIds.includes(staffId),
    )

    const assignmentsByStaffId = new Map(
      currentAssignments.map((assignment) => [
        assignment.staffId,
        assignment.id,
      ]),
    )

    for (const staffId of staffToRemove) {
      const assignmentId = assignmentsByStaffId.get(staffId)
      if (assignmentId) {
        maintenanceCaseStaffAssignmentsCollection.delete(assignmentId)
      }
    }

    for (const staffId of staffToAdd) {
      maintenanceCaseStaffAssignmentsCollection.insert({
        id: crypto.randomUUID(),
        caseId,
        staffId,
        assignedAt: new Date(),
        assignedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  },
  mutationFn: async ({ caseId, updates }) => {
    const { staffIds, ...caseUpdates } = updates

    const response = await fetch('/api/maintenance-cases', {
      body: JSON.stringify({ id: caseId, staffIds, ...caseUpdates }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    })

    if (!response.ok) {
      throw new Error('Failed to update maintenance case')
    }

    const { txid } = await response.json()

    await Promise.all([
      maintenanceCasesCollection.utils.awaitTxId(txid),
      maintenanceCaseStaffAssignmentsCollection.utils.awaitTxId(txid),
    ])

    return { txid }
  },
})

export function CaseEdit() {
  const { caseId } = useParams({ from: '/hangar/$caseId' })
  const navigate = useNavigate()

  const { data: maintenanceCases = [], isLoading } = useLiveQuery(
    maintenanceCasesCollection,
  )
  const { data: assignments = [] } = useLiveQuery(
    maintenanceCaseStaffAssignmentsCollection,
  )

  const maintenanceCase = maintenanceCases.find((c) => c.id === caseId)

  const caseAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) => assignment.caseId === caseId)
        .map((assignment) => ({
          id: assignment.id,
          staffId: assignment.staffId,
        })),
    [assignments, caseId],
  )

  // Get staff IDs for this case
  const caseStaffIds = useMemo(
    () => caseAssignments.map((assignment) => assignment.staffId),
    [caseAssignments],
  )

  const handleSubmit = (data: CaseFormData) => {
    if (!maintenanceCase) return

    void updateCaseWithStaff({
      caseId: maintenanceCase.id,
      currentAssignments: caseAssignments,
      updates: data,
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
            staffIds: caseStaffIds,
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
