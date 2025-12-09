import { createFileRoute } from '@tanstack/react-router'
import { Plane } from 'lucide-react'
import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <Box
      minH="100vh"
      bgGradient="to-b"
      gradientFrom="gray.900"
      gradientVia="gray.800"
      gradientTo="gray.900"
    >
      <Box as="section" position="relative" py={20} px={6} textAlign="center">
        <Box
          position="absolute"
          inset={0}
          bgGradient="to-r"
          gradientFrom="cyan.500/10"
          gradientVia="blue.500/10"
          gradientTo="purple.500/10"
        />
        <Container maxW="5xl" position="relative">
          <Flex justify="center" align="center" gap={6} mb={6}>
            <Plane size={128} color="#22d3ee" />
            <Heading
              as="h1"
              fontSize={{ base: '6xl', md: '7xl' }}
              fontWeight="black"
              bgGradient="to-r"
              gradientFrom="cyan.400"
              gradientTo="blue.400"
              bgClip="text"
            >
              checkPAD
            </Heading>
          </Flex>
          <Text
            fontSize={{ base: '2xl', md: '3xl' }}
            color="gray.300"
            mb={4}
            fontWeight="light"
          >
            Aircraft Maintenance Management System
          </Text>
          <Text fontSize="lg" color="gray.400" maxW="3xl" mx="auto" mb={8}>
            Streamline your aircraft maintenance operations with comprehensive
            tracking, invoice management, and regulatory compliance tools.
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
