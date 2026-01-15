import { createFileRoute } from '@tanstack/react-router'
import { StaffIndex } from '@/components/staff/StaffIndex'

export const Route = createFileRoute('/staff/')({
  component: StaffIndex,
  ssr: false,
})
