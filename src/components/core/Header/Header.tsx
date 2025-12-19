import { Box, Flex, HStack, Heading, IconButton } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { Moon, Plane, Sun } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useColorMode, useColorModeValue } from '@/components/ui/color-mode'

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const headerBg = useColorModeValue('white', 'gray.900')
  const headerBorder = useColorModeValue('gray.200', 'gray.800')
  const textColor = useColorModeValue('gray.900', 'white')
  const linkHoverBg = useColorModeValue('gray.100', 'gray.800')
  const activeLinkBg = useColorModeValue('gray.200', 'gray.700')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = useMemo(
    () => [
      { label: 'Dashboard', to: '/' },
      { label: 'Hangar', to: '/hangar' },
    ],
    [],
  )

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
        <Flex align="center" gap={8}>
          <Link style={{ textDecoration: 'none' }} to="/">
            <Flex
              _hover={{ opacity: 0.75 }}
              align="center"
              gap={3}
              transition="opacity 0.2s"
            >
              <Plane color="#06b6d4" size={32} />
              <Heading as="h1" color={textColor} fontWeight="bold" size="lg">
                check
                <Box as="span" fontStyle="italic">
                  PAD
                </Box>
              </Heading>
            </Flex>
          </Link>
          <HStack as="nav" gap={2}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                style={{ textDecoration: 'none' }}
                to={item.to}
              >
                {({ isActive }) => (
                  <Box
                    _hover={{ bg: linkHoverBg }}
                    bg={isActive ? activeLinkBg : 'transparent'}
                    borderRadius="md"
                    color={textColor}
                    fontWeight={isActive ? 'semibold' : 'medium'}
                    px={4}
                    py={2}
                    transition="background 0.2s"
                  >
                    {item.label}
                  </Box>
                )}
              </Link>
            ))}
          </HStack>
        </Flex>
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
