import { Button, Container, HStack, Heading, Stack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { LuPlus } from 'react-icons/lu'
import { StaffTable } from '../StaffTable'

export function StaffIndex() {
  const navigate = useNavigate()

  return (
    <Container maxW="7xl" py={10}>
      <Stack gap={8}>
        <HStack justify="space-between">
          <Heading>Mitarbeiter</Heading>
          <Button
            colorPalette="brand"
            onClick={() => navigate({ to: '/staff/new' })}
            size="sm"
          >
            <LuPlus />
            Neuer Mitarbeiter
          </Button>
        </HStack>
        <StaffTable />
      </Stack>
    </Container>
  )
}
