import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/**
 * Brand primary color: change the hex values here to test different colors.
 * The palette is auto-derived from the 500 shade.
 */
const brand = {
  50: { value: '#e0f0ff' },
  100: { value: '#b9dafc' },
  200: { value: '#92c5f9' },
  300: { value: '#4394e5' },
  400: { value: '#2b7cd3' },
  500: { value: '#0066cc' }, // ← Keycloak / PatternFly primary
  600: { value: '#004d99' },
  700: { value: '#003366' },
  800: { value: '#032142' },
  900: { value: '#02152b' },
  950: { value: '#010b16' },
}

const config = defineConfig({
  globalCss: {
    html: {
      accentColor: brand[500].value,
    },
  },
  theme: {
    tokens: {
      colors: { brand },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.500}' },
          contrast: { value: 'white' },
          fg: { value: '{colors.brand.700}' },
          muted: { value: '{colors.brand.100}' },
          subtle: { value: '{colors.brand.200}' },
          emphasized: { value: '{colors.brand.300}' },
          focusRing: { value: '{colors.brand.500}' },
          placeholder: { value: '{colors.brand.400}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
