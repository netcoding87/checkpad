import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import type { ReactNode } from 'react'

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ColorModeProvider>
      <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
    </ColorModeProvider>
  )
}
