import { createFileRoute } from '@tanstack/react-router'
import {
  prepareElectricUrl,
  proxyElectricRequest,
} from '@/utils/electric-proxy'

const serve = async ({ request }: { request: Request }) => {
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
