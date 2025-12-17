import { HeadContent, Scripts } from '@tanstack/react-router'
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
          <Header />
          {children}
          <Scripts />
        </Provider>
      </body>
    </html>
  )
}
