'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { Toaster } from './toaster'
import type { ColorModeProviderProps } from './color-mode'

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
      <Toaster />
    </ChakraProvider>
  )
}
