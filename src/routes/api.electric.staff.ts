import { requireApiSession } from '@/lib/auth-session'
import {
  prepareElectricUrl,
  proxyElectricRequest,
} from '@/utils/electric-proxy'
import { createFileRoute } from '@tanstack/react-router'

const serve = async ({ request }: { request: Request }) => {
  const authResult = await requireApiSession(request)

  if (authResult instanceof Response) {
    return authResult
  }

  const originUrl = prepareElectricUrl(request.url)
  originUrl.searchParams.set('table', 'staff')

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/electric/staff')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
