import { createFileRoute } from '@tanstack/react-router'
import {
  prepareElectricUrl,
  proxyElectricRequest,
} from '@/utils/electric-proxy'

const serve = async ({ request }: { request: Request }) => {
  const originUrl = prepareElectricUrl(request.url)
  originUrl.searchParams.set('table', 'maintenance_cases')

  return proxyElectricRequest(originUrl)
}

export const Route = createFileRoute('/api/maintenance-cases')({
  server: {
    handlers: {
      GET: serve,
    },
  },
})
