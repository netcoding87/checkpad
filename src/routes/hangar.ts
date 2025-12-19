import { createFileRoute } from '@tanstack/react-router'
import { HangarCalendar } from '@/components/maintenance/HangarCalendar'

export const Route = createFileRoute('/hangar')({
  component: HangarCalendar,
  ssr: false,
})
