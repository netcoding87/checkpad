import { HeadContent, Scripts } from '@tanstack/react-router'
import { AuthInitializer } from '@/components/core/AuthInitializer/AuthInitializer'
import { Header } from '@/components/core/Header'
import { Provider } from '@/components/ui/provider'

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Provider>
          <AuthInitializer>
            <Header />
            {children}
          </AuthInitializer>
          <Scripts />
        </Provider>
      </body>
    </html>
  )
}
