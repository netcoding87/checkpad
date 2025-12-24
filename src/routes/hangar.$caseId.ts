import { createFileRoute } from '@tanstack/react-router'
import { CaseEdit } from '@/components/maintenance/CaseEdit'

export const Route = createFileRoute('/hangar/$caseId')({
  component: CaseEdit,
  ssr: false,
})
