import { Container, Heading, Stack } from '@chakra-ui/react'
import { MaintenanceCasesTable } from '@/components/maintenance/MaintenanceCasesTable'

export function Dashboard() {
  return (
    <Container maxW="7xl" py={8}>
      <Stack gap={6}>
        <Heading size="xl">Dashboard</Heading>
        <MaintenanceCasesTable />
      </Stack>
    </Container>
  )
}
