import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hangar')({
  component: Outlet,
  ssr: false,
})
