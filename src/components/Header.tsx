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
      <Flex align="center" justify="space-between">
        <Link style={{ textDecoration: 'none' }} to="/">
          <Flex
            _hover={{ opacity: 0.75 }}
            align="center"
            gap={3}
            transition="opacity 0.2s"
          >
            <Plane color="#06b6d4" size={32} />
            <Heading as="h1" color={textColor} fontWeight="bold" size="lg">
              checkPAD
            </Heading>
          </Flex>
        </Link>
        <IconButton
          aria-label="Toggle theme"
          color={textColor}
          onClick={toggleColorMode}
          size="md"
          variant="ghost"
        >
          {mounted && colorMode === 'dark' ? (
            <Sun color="#fbbf24" size={24} />
          ) : (
            <Moon color="#64748b" size={24} />
          )}
        </IconButton>
      </Flex>
    </Box>
  )
}
