import { Box, Flex, Heading, IconButton } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { Moon, Plane, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useColorMode, useColorModeValue } from './ui/color-mode'

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const headerBg = useColorModeValue('white', 'gray.900')
  const headerBorder = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.900', 'white')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Box
      as="header"
      bg={headerBg}
      borderBottom="2px"
      borderColor={headerBorder}
      px={6}
      py={4}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Flex
            align="center"
            gap={3}
            _hover={{ opacity: 0.75 }}
            transition="opacity 0.2s"
          >
            <Plane size={32} color="#06b6d4" />
            <Heading as="h1" size="lg" fontWeight="bold" color={textColor}>
              checkPAD
            </Heading>
          </Flex>
        </Link>
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle theme"
          variant="ghost"
          size="md"
          color={textColor}
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
