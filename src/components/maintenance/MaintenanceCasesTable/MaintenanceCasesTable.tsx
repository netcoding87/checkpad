import {
  Badge,
  Box,
  HStack,
  Heading,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react'
import { useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { Users } from 'lucide-react'
import {
  maintenanceCaseStaffCollection,
  maintenanceCasesCollection,
} from '@/db/collections'
import { toCommercial } from '@/utils/number'

function getStatus(maintenanceCase: {
  offerCreatedAt: Date | null
  offerAcceptedAt: Date | null
  invoiceCreatedAt: Date | null
  invoicePaidAt: Date | null
}) {
  if (maintenanceCase.invoicePaidAt)
    return { label: 'Paid', colorScheme: 'green' as const }
  if (maintenanceCase.invoiceCreatedAt)
    return { label: 'Invoiced', colorScheme: 'orange' as const }
  if (maintenanceCase.offerAcceptedAt)
    return { label: 'Accepted', colorScheme: 'teal' as const }
  if (maintenanceCase.offerCreatedAt)
    return { label: 'Offered', colorScheme: 'purple' as const }
  return { label: 'Draft', colorScheme: 'gray' as const }
}

export function MaintenanceCasesTable() {
  const { data: maintenanceCases = [], isLoading } = useLiveQuery(
    maintenanceCasesCollection,
  )
  const { data: assignments = [] } = useLiveQuery(
    maintenanceCaseStaffCollection,
  )

  // Create a map of case IDs to assignment counts
  const assignmentCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const assignment of assignments) {
      counts[assignment.caseId] = (counts[assignment.caseId] || 0) + 1
    }
    return counts
  }, [assignments])

  return (
    <Stack gap={4}>
      <HStack justify="space-between">
        <Heading size="lg">Maintenance Cases</Heading>
        <Text color="fg.muted">{maintenanceCases.length} total</Text>
      </HStack>

      <Box
        bg="bg.panel"
        borderColor="border"
        borderWidth="1px"
        rounded="lg"
        shadow="sm"
      >
        <Table.ScrollArea>
          <Table.Root size="md" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Estimated Hours
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Estimated Costs
                </Table.ColumnHeader>
                <Table.ColumnHeader>Planned Start</Table.ColumnHeader>
                <Table.ColumnHeader>Planned End</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Staff</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={`skeleton-${i}`}>
                      <Table.Cell colSpan={7}>
                        <Skeleton height="24px" rounded="md" />
                      </Table.Cell>
                    </Table.Row>
                  ))
                : maintenanceCases.map((maintenanceCase) => {
                    const status = getStatus(maintenanceCase)
                    const staffCount = assignmentCounts[maintenanceCase.id] || 0
                    return (
                      <Table.Row key={maintenanceCase.id}>
                        <Table.Cell maxW="sm">
                          <Text fontWeight="medium" lineClamp={1}>
                            {maintenanceCase.name}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text color="fg.muted">
                            {maintenanceCase.estimatedHours != null
                              ? maintenanceCase.estimatedHours.toLocaleString(
                                  'de-DE',
                                  {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 2,
                                  },
                                )
                              : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text color="fg.muted">
                            {maintenanceCase.estimatedCosts != null
                              ? toCommercial(maintenanceCase.estimatedCosts)
                              : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="fg.muted">
                            {new Date(
                              maintenanceCase.plannedStart,
                            ).toLocaleDateString()}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="fg.muted">
                            {new Date(
                              maintenanceCase.plannedEnd,
                            ).toLocaleDateString()}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={status.colorScheme}
                            rounded="md"
                            variant="subtle"
                          >
                            {status.label}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          {staffCount > 0 ? (
                            <HStack gap={1}>
                              <Users size={16} />
                              <Text>{staffCount}</Text>
                            </HStack>
                          ) : (
                            <Badge colorPalette="gray" variant="subtle">
                              Keine Zuweisung
                            </Badge>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Box>
    </Stack>
  )
}
