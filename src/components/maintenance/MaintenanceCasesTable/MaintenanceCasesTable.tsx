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
import { maintenanceCasesCollection } from '@/db/collections'

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

  console.log('Maintenance Cases:', maintenanceCases)

  return (
    <Stack gap={4}>
      <HStack justify="space-between">
        <Heading size="lg">Maintenance Cases</Heading>
        <Text color="fg.muted">{maintenanceCases.length} total</Text>
      </HStack>

      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="lg"
        shadow="sm"
      >
        <Table.ScrollArea>
          <Table.Root variant="line" size="md">
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
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={`skeleton-${i}`}>
                      <Table.Cell colSpan={6}>
                        <Skeleton height="24px" rounded="md" />
                      </Table.Cell>
                    </Table.Row>
                  ))
                : maintenanceCases.map((maintenanceCase) => {
                    const status = getStatus(maintenanceCase)
                    return (
                      <Table.Row key={maintenanceCase.id}>
                        <Table.Cell maxW="sm">
                          <Text lineClamp={1} fontWeight="medium">
                            {maintenanceCase.name}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text color="fg.muted">
                            {maintenanceCase.estimatedHours ?? '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text color="fg.muted">
                            {maintenanceCase.estimatedCosts ?? '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="fg.muted">
                            {maintenanceCase.plannedStart
                              ? new Date(
                                  maintenanceCase.plannedStart,
                                ).toLocaleDateString()
                              : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="fg.muted">
                            {maintenanceCase.plannedEnd
                              ? new Date(
                                  maintenanceCase.plannedEnd,
                                ).toLocaleDateString()
                              : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            variant="subtle"
                            colorPalette={status.colorScheme}
                            rounded="md"
                          >
                            {status.label}
                          </Badge>
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
