import { Box, Center, Spinner, Text, VStack } from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await authClient.getSession()

      if (!session) {
        // Store the current URL so we can restore it after login
        const returnUrl = window.location.pathname + window.location.search
        sessionStorage.setItem('auth_return_url', returnUrl)

        // Use better-auth's OAuth2 sign-in — handles PKCE & state automatically
        await authClient.signIn.oauth2({
          callbackURL: window.location.origin,
          providerId: 'keycloak',
        })
        // Keep the spinner showing while the browser navigates away
        return
      }

      // Session is valid — restore the page the user originally requested
      const returnUrl = sessionStorage.getItem('auth_return_url')
      if (returnUrl && returnUrl !== '/') {
        sessionStorage.removeItem('auth_return_url')
        navigate({ to: returnUrl })
      }

      setIsChecking(false)
    }

    checkAuth().catch((error: unknown) => {
      console.error('Auth check failed:', error)
      setIsChecking(false)
    })
  }, [navigate])

  if (isChecking) {
    return (
      <Center h="100vh" w="100%">
        <VStack gap={4}>
          <Spinner aria-label="Loading" color="cyan.500" size="xl" />
          <Box>
            <Text color="gray.500" fontSize="xs" fontWeight="medium">
              Initializing your app...
            </Text>
          </Box>
        </VStack>
      </Center>
    )
  }

  return <>{children}</>
}
