import { createRootRouteWithContext } from '@tanstack/react-router'

import { RootDocument } from '@/components/core/Root'

export const Route = createRootRouteWithContext()({
  head: () => ({
    links: [
      {
        href: '/favicon.svg',
        rel: 'icon',
        type: 'image/svg+xml',
      },
    ],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'checkPAD',
      },
    ],
  }),

  shellComponent: RootDocument,
})
