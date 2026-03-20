import { LoginPage } from '@/components/core/LoginPage/LoginPage'
import { getSession } from '@/lib/auth.functions'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
  ssr: false,
})
