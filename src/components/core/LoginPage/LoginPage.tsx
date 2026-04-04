import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { authClient } from '@/lib/auth-client'

export function LoginPage() {
  const handleSignIn = async () => {
    const params = new URLSearchParams(window.location.search)
    const callbackURL = params.get('redirect') || '/'

    await authClient.signIn.oauth2({
      callbackURL,
      providerId: 'keycloak',
    })
  }

  return (
    <Box mx="auto" mt={24} px={6} width="full" maxW="lg">
      <Stack borderRadius="xl" borderWidth="1px" gap={6} p={8} shadow="lg">
        <Heading size="lg">Sign In to checkPAD</Heading>
        <Text color="fg.muted">
          Access is restricted to authorized users. Continue with Keycloak.
        </Text>
        <Button colorPalette="brand" onClick={handleSignIn} size="lg">
          Sign in with Keycloak
        </Button>
      </Stack>
    </Box>
  )
}
