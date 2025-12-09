import { Box, Flex, Heading, IconButton } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { Moon, Plane, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useColorMode, useColorModeValue } from './ui/color-mode'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const headerBg = useColorModeValue('gray.800', 'gray.900')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Box as="header" bg={headerBg} color="white" px={4} py={4} shadow="lg">
      <Flex justify="space-between" align="center">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex
            align="center"
            gap={3}
            _hover={{ opacity: 0.8 }}
            transition="opacity 0.2s"
          >
            <Plane size={32} color="#22d3ee" />
            <Heading as="h1" size="xl" fontWeight="bold">
              checkPAD
            </Heading>
          </Flex>
        </Link>
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle theme"
          variant="ghost"
          colorPalette="gray"
        >
          {mounted && colorMode === 'dark' ? (
            <Sun size={24} color="#fbbf24" />
          ) : (
            <Moon size={24} color="#64748b" />
          )}
        </IconButton>
      </Flex>
    </Box>
  )
}
