import { createFileRoute } from '@tanstack/react-router'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useColorModeValue } from '@/components/ui/color-mode'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.900', 'white')
  const secondaryText = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box bg={bgColor} color={textColor} minH="100vh">
      <Box as="section" px={6} py={20}>
        <Container maxW="4xl">
          <VStack align="center" gap={8} textAlign="center">
            <Heading
              as="h1"
              color={textColor}
              fontSize={{ base: '4xl', md: '5xl' }}
              fontWeight="bold"
            >
              Welcome to checkPAD
            </Heading>
            <Text color={secondaryText} fontSize="lg" maxW="2xl">
              Aircraft Maintenance Management System
            </Text>
            <Text fontSize="md" color={secondaryText} maxW="2xl" mb={4}>
              Streamline your aircraft maintenance operations with comprehensive
              tracking, invoice management, and regulatory compliance tools.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}
