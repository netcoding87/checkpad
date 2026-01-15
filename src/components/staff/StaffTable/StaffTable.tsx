import {
  Badge,
  Box,
  HStack,
  Heading,
  IconButton,
  Skeleton,
  Stack,
  Table,
  Text,
} from '@chakra-ui/react'
import { useLiveQuery } from '@tanstack/react-db'
import { useNavigate } from '@tanstack/react-router'
import { LuPencil, LuTrash2 } from 'react-icons/lu'
import { toCommercial } from '@/utils/number'
import { staffCollection } from '@/db/collections'

export function StaffTable() {
  const { data: staff = [], isLoading } = useLiveQuery(staffCollection)
  const navigate = useNavigate()

  const handleEdit = (staffId: string) => {
    navigate({ to: `/staff/${staffId}` })
  }

  const handleDelete = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      const staffMember = staff.find((s) => s.id === staffId)
      if (!staffMember) return

      // Use the collection's onDelete handler
      await staffCollection.delete(staffId)
    } catch (error) {
      console.error('Failed to delete staff member:', error)
    }
  }

  return (
    <Stack gap={4}>
      <HStack justify="space-between">
        <Heading size="lg">Staff</Heading>
        <Text color="fg.muted">{staff.length} total</Text>
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
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Phone</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Hourly Rate
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Vacation Days
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Sick Days
                </Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Actions
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <Table.Row key={`skeleton-${i}`}>
                      <Table.Cell colSpan={8}>
                        <Skeleton height="24px" rounded="md" />
                      </Table.Cell>
                    </Table.Row>
                  ))
                : staff.map((staffMember) => {
                    const statusColor = staffMember.isActive ? 'green' : 'gray'
                    const statusLabel = staffMember.isActive
                      ? 'Active'
                      : 'Inactive'

                    return (
                      <Table.Row key={staffMember.id}>
                        <Table.Cell maxW="sm">
                          <Text fontWeight="medium" lineClamp={1}>
                            {staffMember.firstName} {staffMember.lastName}
                          </Text>
                        </Table.Cell>
                        <Table.Cell maxW="md">
                          <Text color="fg.muted" lineClamp={1}>
                            {staffMember.email}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Text color="fg.muted">
                            {staffMember.phone ? staffMember.phone : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text color="fg.muted">
                            {staffMember.hourlyRate != null
                              ? toCommercial(staffMember.hourlyRate)
                              : '-'}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text color="fg.muted">
                            {staffMember.vacationDaysUsed} /{' '}
                            {staffMember.vacationDaysTotal}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text color="fg.muted">
                            {staffMember.sickDaysUsed}
                          </Text>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            colorPalette={statusColor}
                            rounded="md"
                            variant="subtle"
                          >
                            {statusLabel}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <HStack gap={0} justify="center">
                            <IconButton
                              aria-label="Edit staff member"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(staffMember.id)}
                            >
                              <LuPencil />
                            </IconButton>
                            <IconButton
                              aria-label="Delete staff member"
                              size="sm"
                              variant="ghost"
                              colorPalette="red"
                              onClick={() => handleDelete(staffMember.id)}
                            >
                              <LuTrash2 />
                            </IconButton>
                          </HStack>
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
