import { createFileRoute } from '@tanstack/react-router'
import { StaffNew } from '@/components/staff/StaffNew'

export const Route = createFileRoute('/staff/new')({
  component: StaffNew,
  ssr: false,
})
