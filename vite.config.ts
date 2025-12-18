import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults } from 'vitest/config'

const config = defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      devtools(),
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart(),
      viteReact({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
    ],
    server: {
      open: command === 'serve',
      port: command === 'serve' ? parseInt(env.PORT) : undefined,
    },
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          ...coverageConfigDefaults.exclude,
          'src/test/',
          'src/components/ui',
          '**/*.d.ts',
          '**/*.config.*',
          '**/routeTree.gen.ts',
          'dist/',
          'drizzle/',
          'scripts/',
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.ts',
    },
  }
})

export default config
