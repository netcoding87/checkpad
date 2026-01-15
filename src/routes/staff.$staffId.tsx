import { createFileRoute } from '@tanstack/react-router'
import { StaffEdit } from '@/components/staff/StaffEdit'

export const Route = createFileRoute('/staff/$staffId')({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { staffId } = Route.useParams()
  return <StaffEdit staffId={staffId} />
}
