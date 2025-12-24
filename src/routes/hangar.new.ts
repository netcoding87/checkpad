import { createFileRoute } from '@tanstack/react-router'
import { CaseNew } from '@/components/maintenance/CaseNew'

export const Route = createFileRoute('/hangar/new')({
  component: CaseNew,
  ssr: false,
})
