import { createFileRoute } from '@tanstack/react-router'
import { requireApiSession } from '@/lib/auth-session'
import {
  prepareElectricUrl,
  proxyElectricRequest,
} from '@/utils/electric-proxy'

const serve = async ({ request }: { request: Request }) => {
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const originUrl = prepareElectricUrl(request.url)
  originUrl.searchParams.set('table', 'maintenance_cases')

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/electric/maintenance-cases')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
