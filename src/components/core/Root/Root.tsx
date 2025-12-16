import { HeadContent, Scripts } from '@tanstack/react-router'
import { Header } from '@/components/core/Header'
import { Provider } from '@/components/ui/provider'

export function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <Header />
          {children}
          <Scripts />
        </body>
      </html>
    </Provider>
  )
}
