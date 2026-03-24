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
  originUrl.searchParams.set('table', 'maintenance_case_staff')

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/electric/maintenance-case-staff')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
